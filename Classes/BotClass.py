import json
import decimal
import time
import datetime as dt
from pathlib import Path

import pandas as pd

from binance.client import Client
from binance.websockets import BinanceSocketManager

with open(Path(__file__).parent / "../JSON/Key.json") as f:
    data = json.load(f)

binance = Client(data["APIKEY"], data["APISECRET"])


def process_message(msg):
    pass


def get_pairs():
    return ["DOGEUSDT"]


pairs = get_pairs()


def get_balance():
    with open(Path(__file__).parent / "../JSON/Balance.json", "r") as f:
        try:
            return json.load(f)
        except:
            return {"ERR": "FAILED TO OPEN BALANCE FILE"}


def update_balance(amount, name, price, sold):
    balance = get_balance()
    if sold:
        balance.pop(name[:-4], None)
        balance["USDT"] = str(float(balance["USDT"]) + (amount*price))
    else:
        balance["USDT"] = str(float(balance["USDT"]) - (amount*price))
        balance[name[:-4]] = str(amount)

    save_balance(balance)
    return balance


def save_balance(balance):
    with open(Path(__file__).parent / "../JSON/Balance.json", "w") as f:
        json.dump(balance, f, indent=4)


def get_crypto_data(symbol, since):
    bm = BinanceSocketManager(binance)
    bm.start_aggtrade_socket(symbol, process_message)
    bm.start()

    interval = '3m'
    past_days = since

    start_str = str(
        (pd.to_datetime('today')-pd.Timedelta(str(past_days)+' days')).date())

    D = binance.get_historical_klines(
        symbol=symbol, start_str=start_str, interval=interval)

    return D


def get_purchasing_price(name):
    trades = binance.get_symbol_ticker()
    for x in trades:
        if(x["symbol"] == name):
            return x["price"]


def load_trades():
    trades = {}
    with open(Path(__file__).parent / "../JSON/Trades.json", "r") as f:
        try:
            trades = json.load(f)
        except:
            for crypto in pairs:
                trades[crypto] = []
        return trades


def save_crypto_data(data):
    with open(Path(__file__).parent / "../JSON/Data.json", "w") as f:
        json.dump(data, f, indent=4)


def load_crypto_data_from_file():
    data = {}
    with open(Path(__file__).parent / "../JSON/Data.json", "r") as f:
        try:
            data = json.load(f)
        except:
            data = make_crypto_data(data)
            save_crypto_data(data)
    return data


def make_crypto_data(data):
    for name in get_pairs():
        data[name] = {
            "high": [],
            "low": [],
            "close": [],
            "prices": []
        }
    return data


def save_trade(close, name, bought, sold, amount):
    trade = {
        "time_stamp": str(int(time.time())),
        "price_usd": close,
        "bought": bought,
        "sold": sold,
        "amount": amount
    }
    print("TRADE:\n"+json.dumps(trade, indent=4))
    trades = load_trades()
    trades[name].append(trade)
    with open(Path(__file__).parent / "../JSON/Trades.json", "w") as f:
        json.dump(trades, f, indent=4)


def buy_crypto(crypto_data, name):
    analysis_data = clear_crypto_data(name)
    #order = binance.order_market_buy(name, 0)
    price = float(crypto_data[-1][4])
    funds = get_available_funds()
    amount = funds * (1/price)
    balance = update_balance(amount, name, price, False)
    save_trade(price, name, True, False, amount)
    print("BUY")


def sell_crypto(crypto_data, name):
    balance = get_balance()
    analysis_data = clear_crypto_data(name)
    price = float(crypto_data[-1][4])
    amount = float(balance[name[:-4]])
    balance = update_balance(amount, name, price, True)
    save_trade(price, name, False, True, amount)
    print("SELL")


def clear_crypto_data(name):
    data = load_crypto_data_from_file()
    for key in data[name]:
        data[name][key] = delete_entries(data[name], key)
    save_crypto_data(data)
    return data


def delete_entries(data, key):
    clean = []
    for entry in data[key][-10:]:
        clean.append(entry)
    return clean


def get_available_funds():
    balance = get_balance()
    money = float(balance["USDT"])
    crypto_not_owned = 1+(len(balance)-1)
    funds = money / crypto_not_owned
    return funds


def Run(since, pairs, mva):
    #while True:
    for pair in pairs:
        trades = load_trades()
        if len(trades[pair]) > 0:
            crypto_data = get_crypto_data(pair, since)
            if trades[pair][-1]['sold'] or trades[pair][-1] == None:
                check_data(pair, crypto_data, True, mva)
            if trades[pair][-1]['bought']:
                check_data(pair, crypto_data, False, mva)
        else:
            crypto_data = get_crypto_data(symbol=pair, since=since)
            check_data(pair, crypto_data, True, mva)
    time.sleep(119)


def check_data(name, crypto_data, buy, mva):
    high = 0
    low = 0
    close = 0

    for b in crypto_data:
        if b not in mva[name]['prices']:
            mva[name]["prices"].append(b)

        high += float(b[3])
        low += float(b[4])
        close += float(b[5])

    mva[name]["high"].append(high/100)
    mva[name]["low"].append(low/100)
    mva[name]["close"].append(close/100)

    save_crypto_data(mva)

    if buy:
        try_buy(mva[name], name, crypto_data)
    else:
        try_sell(mva[name], name, crypto_data)


def try_buy(data, name, crypto_data):
    make_trade = check_opportunity(data, name, False, True)
    if make_trade:
        buy_crypto(crypto_data, name)


def try_sell(data, name, crypto_data):
    make_trade = check_opportunity(data, name, True, False)
    if make_trade:
        sell_crypto(crypto_data, name)


def check_opportunity(data, name, sell, buy):
    count = 0
    previous_value = 0
    trends = []
    for mva in data["close"][-10:]:
        if previous_value == 0:
            previous_value = mva
        else:
            if mva/previous_value > 1:
                if count < 1:
                    count = 1
                else:
                    count += 1
                trends.append("UPTREND")
            elif mva/previous_value < 1:
                trends.append("DOWNTREND")
                if count > 0:
                    count = -1
                else:
                    count -= 1
            else:
                trends.append("NOTREND")
            previous_value = mva
    areas = []
    for mva in reversed(data["close"][-5:]):
        area = 0
        price = float(data["prices"][-1][3])
        if sell:
            purchase_price = float(get_purchasing_price(name))
            if price >= (purchase_price * 1.02):
                print("Should sell with 10% profit")
                return True
            if price < purchase_price:
                print("Selling at a loss")
                return True
        areas.append(mva / price)

    if buy:
        counter = 0
        if count >= 5:
            for area in areas:
                counter += area
            if counter / 3 >= 1.5:
                return True
    return False
