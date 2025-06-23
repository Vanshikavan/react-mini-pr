import React, { useState, useEffect } from "react";
import InputBox from "./components/InputBox";
import BackgroundImage from './assets/gallery-3.webp';


function useCurrencyInfo(currency) {
    const [data, setData] = useState({});

    useEffect(() => {
        let url = `https://api.frankfurter.app/latest?from=${currency}`;
        console.log(`Attempting to fetch data from Frankfurter API: ${url}`);

        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}. Could not fetch from Frankfurter API.`);
                }
                return res.json();
            })
            .then((res) => {
                setData(res.rates);
                console.log(`Successfully fetched data for ${currency}:`, res.rates);
            })
            .catch((error) => {
                console.error("Error fetching currency data:", error);
            });
    }, [currency]);

    return data;
}

function App() {
    const [amount, setAmount] = useState(0);
    const [fromCurrency, setFromCurrency] = useState("usd");
    const [toCurrency, setToCurrency] = useState("inr");
    const [convertedAmount, setConvertedAmount] = useState(0);

    const currencyInfo = useCurrencyInfo(fromCurrency);

    const options = Object.keys(currencyInfo);

    const convert = () => {
        if (currencyInfo && currencyInfo[toCurrency]) {
            setConvertedAmount(amount * currencyInfo[toCurrency]);
        } else {
            setConvertedAmount("N/A");
            console.warn(`Conversion rate for ${toCurrency} not found from ${fromCurrency} data.`);
        }
    };

    const swap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setConvertedAmount(amount);
        setAmount(convertedAmount);
    };

    return (
        <div
            className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url('${BackgroundImage}')`,
            }}
        >
            <div className="w-full">
                <div
                    className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            convert();
                        }}
                    >
                        <div className="w-full mb-1">
                            <InputBox
                                label="From"
                                amount={amount}
                                currencyOptions={options}
                                onAmountChange={setAmount}
                                onCurrencyChange={setFromCurrency}
                                selectedCurrency={fromCurrency}
                            />
                        </div>
                        <div className="relative w-full h-0.5">
                            <button
                                type="button"
                                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
                                onClick={swap}
                            >
                                swap
                            </button>
                        </div>
                        <div className="w-full mt-1 mb-4">
                            <InputBox
                                label="To"
                                amount={convertedAmount}
                                currencyOptions={options}
                                onCurrencyChange={setToCurrency}
                                selectedCurrency={toCurrency}
                                amountDisabled
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg"
                        >
                            Convert {fromCurrency.toUpperCase()} to {toCurrency.toUpperCase()}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;