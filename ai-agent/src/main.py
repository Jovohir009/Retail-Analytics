from __future__ import annotations

import argparse

from agent import RetailAnalyticsAgent
from config.settings import AgentSettings
from logging_config import configure_logging


def main() -> None:
    parser = argparse.ArgumentParser(description="Retail Analytics AI Agent")
    parser.add_argument("--config", help="Path to JSON configuration file", default=None)
    args = parser.parse_args()
    logger = configure_logging()
    settings = AgentSettings.load(args.config)
    RetailAnalyticsAgent(settings=settings, logger=logger).run()


if __name__ == "__main__":
    main()
