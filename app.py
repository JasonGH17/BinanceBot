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

Bot.startup()

since = 0.25  # Half a day (12 Hours)
pairs = get_pair()
mva = Bot.load_crypto_data_from_file()

if __name__ == "__main__":
    i=0
    while True:
        s = get_run()
        if s:
            if(i==1):
                i=0
                print("Bot state: ON")
            Bot.Run(since, pairs, mva)
        else:
            if(i==0):
                i=1
                print("Bot state: OFF")
        time.sleep(1)
        