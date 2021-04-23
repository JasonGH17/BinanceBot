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

if __name__ == "__main__":
    while True:
        s = get_run()
        if s:
            Bot.Run(since, pairs, mva)
        else:
            print("Bot state: OFF")
        time.sleep(1)
        