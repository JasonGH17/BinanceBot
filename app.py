from pathlib import Path
import json
import time
import Classes.BotClass as Bot

state = "False"

since = 0.5  # Half a day (12 Hours)
pairs = Bot.get_pairs()
mva = Bot.load_crypto_data_from_file()

def get_run():
    with open(Path(__file__).parent / "./state.json", "r") as f:
        return json.load(f)["state"]

if __name__ == "__main__":
    while True:
        s = get_run()
        while s:
            Bot.Run(since, pairs, mva)
        time.sleep(1)
        