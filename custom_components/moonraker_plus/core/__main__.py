"""Standalone CLI for validating data capture (read-only).

    python -m moonraker_core watch                 live view of all printers
    python -m moonraker_core snapshot              save raw + parsed state to captures/
    python -m moonraker_core record --seconds 600  save every notification to captures/
    python -m moonraker_core fixture tests/fixtures/k2plus   render a saved fixture offline

Printers come from printers.json (or --printer name=host[:port], repeatable).
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any

import aiohttp

from .printer import Printer, PrinterState
from .render import render_state, state_to_dict

ROOT = Path.cwd()
DEFAULT_CONFIG = ROOT / "printers.json"
CAPTURES = ROOT / "captures"


def load_printers(args: argparse.Namespace) -> list[tuple[str, str, int]]:
    out: list[tuple[str, str, int]] = []
    if args.printer:
        for spec in args.printer:
            name, _, addr = spec.partition("=")
            host, _, port = addr.partition(":")
            out.append((name, host, int(port or 7125)))
    else:
        cfg = json.loads(Path(args.config).read_text())
        for p in cfg["printers"]:
            out.append((p["name"], p["host"], int(p.get("port", 7125))))
    if args.only:
        out = [p for p in out if p[0] in args.only]
    return out


def load_fixture(path: Path) -> dict[str, Any]:
    out = {}
    for f in path.glob("*.json"):
        data = json.loads(f.read_text())
        out[f.stem] = data.get("result", data)
    return out


async def wait_ready(printers: list[Printer], timeout: float) -> None:
    """Wait until every printer has status (and metadata, if printing) or the timeout hits."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        def done(p: Printer) -> bool:
            st = p.state
            if not st.status:
                return False
            return not st.job.filename or st.file_metadata is not None
        if all(done(p) for p in printers):
            return
        await asyncio.sleep(0.2)


async def cmd_watch(args: argparse.Namespace) -> None:
    async with aiohttp.ClientSession() as session:
        printers = [Printer(n, h, p, session=session) for n, h, p in load_printers(args)]
        for p in printers:
            p.start()
        try:
            while True:
                screen = "\n\n".join(render_state(p.name, p.client.host, p.state) for p in printers)
                sys.stdout.write("\x1b[2J\x1b[H" + datetime.now().strftime("%H:%M:%S") + "\n\n" + screen + "\n")
                sys.stdout.flush()
                await asyncio.sleep(args.interval)
        finally:
            await asyncio.gather(*(p.stop() for p in printers))


async def cmd_snapshot(args: argparse.Namespace) -> None:
    out = Path(args.out) if args.out else CAPTURES / datetime.now().strftime("%Y%m%d-%H%M%S")
    out.mkdir(parents=True, exist_ok=True)
    async with aiohttp.ClientSession() as session:
        printers = [Printer(n, h, p, session=session) for n, h, p in load_printers(args)]
        for p in printers:
            p.start()
        await wait_ready(printers, args.timeout)
        for p in printers:
            st = p.state
            (out / f"{p.name}.raw.json").write_text(
                json.dumps(
                    {
                        "server_info": st.server_info,
                        "printer_info": st.printer_info,
                        "objects": st.objects,
                        "status": st.status,
                        "file_metadata": st.file_metadata,
                        "webcams": st.webcams,
                    },
                    indent=2,
                    default=str,
                )
            )
            (out / f"{p.name}.parsed.json").write_text(json.dumps(state_to_dict(st), indent=2, default=str))
            print(render_state(p.name, p.client.host, st), end="\n\n")
        await asyncio.gather(*(p.stop() for p in printers))
    print(f"saved to {out}")


async def cmd_record(args: argparse.Namespace) -> None:
    out = Path(args.out) if args.out else CAPTURES / ("record-" + datetime.now().strftime("%Y%m%d-%H%M%S"))
    out.mkdir(parents=True, exist_ok=True)
    files = {}

    def on_raw(p: Printer, method: str, params: list[Any]) -> None:
        if method == "notify_proc_stat_update" and not args.include_proc_stats:
            return
        f = files.get(p.name)
        if f is None:
            f = files[p.name] = open(out / f"{p.name}.jsonl", "a", encoding="utf-8")  # noqa: SIM115
        f.write(json.dumps({"t": time.time(), "method": method, "params": params}, default=str) + "\n")

    async with aiohttp.ClientSession() as session:
        printers = [Printer(n, h, p, session=session, raw_listener=on_raw) for n, h, p in load_printers(args)]
        for p in printers:
            p.start()
        await wait_ready(printers, 15)
        for p in printers:
            (out / f"{p.name}.initial.json").write_text(
                json.dumps({"objects": p.state.objects, "status": p.state.status}, indent=2, default=str)
            )
        print(f"recording {len(printers)} printer(s) for {args.seconds}s -> {out}")
        try:
            await asyncio.sleep(args.seconds)
        finally:
            await asyncio.gather(*(p.stop() for p in printers))
            for f in files.values():
                f.close()
    print("done")


def cmd_fixture(args: argparse.Namespace) -> None:
    for path in args.paths:
        st = PrinterState.from_fixture(load_fixture(Path(path)))
        if args.json:
            print(json.dumps(state_to_dict(st), indent=2, default=str))
        else:
            print(render_state(Path(path).name, "(fixture)", st), end="\n\n")


def main() -> None:
    ap = argparse.ArgumentParser(prog="moonraker_core", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("-v", "--verbose", action="store_true")
    sub = ap.add_subparsers(dest="cmd", required=True)

    def add_targets(p: argparse.ArgumentParser) -> None:
        p.add_argument("--config", default=str(DEFAULT_CONFIG))
        p.add_argument("--printer", action="append", help="name=host[:port] (overrides --config)")
        p.add_argument("--only", nargs="+", help="only these printer names")

    p = sub.add_parser("watch", help="live view")
    add_targets(p)
    p.add_argument("--interval", type=float, default=2.0)

    p = sub.add_parser("snapshot", help="save raw + parsed state")
    add_targets(p)
    p.add_argument("--out")
    p.add_argument("--timeout", type=float, default=15.0)

    p = sub.add_parser("record", help="record all notifications to jsonl")
    add_targets(p)
    p.add_argument("--seconds", type=float, default=300)
    p.add_argument("--out")
    p.add_argument("--include-proc-stats", action="store_true")

    p = sub.add_parser("fixture", help="render saved fixture dir(s) offline")
    p.add_argument("paths", nargs="+")
    p.add_argument("--json", action="store_true")

    args = ap.parse_args()
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.WARNING)
    if args.cmd == "fixture":
        cmd_fixture(args)
        return
    try:
        asyncio.run({"watch": cmd_watch, "snapshot": cmd_snapshot, "record": cmd_record}[args.cmd](args))
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
