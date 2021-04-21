import Classes.BotClass as Bot
from pathlib import Path
import json
import time

def get_pair():
    with open(Path(__file__).parent / "./state.json", "r") as f:
        return json.load(f)["pair"]
def get_run():
    with open(Path(__file__).parent / "./state.json", "r") as f:
        return json.load(f)["state"]


since = 0.5  # Half a day (12 Hours)
pairs = get_pair()
mva = Bot.load_crypto_data_from_file()

Bot.set_pairs(pairs)

if __name__ == "__main__":
    while True:
        s = get_run()
        while s:
            Bot.Run(since, pairs, mva)
        time.sleep(1)
        