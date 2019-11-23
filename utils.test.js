const getType = require('jest-get-type');

const handleSortedData = require("./server");

test("To check whether function exists or not", () => {
    expect(handleSortedData).toBeDefined();
})

test("check the type of value returned is object or not", () => {
    const givenArray = [
        {
            "ip": "55.55.55.55",
            "timestamp": "3/11/2016 17:18:19",
            "amount": 11.25
        },
        {
            "ip": "55.55.55.55",
            "timestamp": "3/11/2016 17:18:19",
            "amount": 11.25
        },
    ]
    const returnedValue = handleSortedData(givenArray);
    expect(typeof returnedValue).toBe('object');
})

test("To check whether array is sorted  on the basis of amount is giving object which has highest amount in that period", () => {
    const givenArray = [
        {
            "ip": "55.55.55.55",
            "timestamp": "3/11/2016 17:18:19",
            "amount": 11.25
        },
        {
            "ip": "55.55.55.55",
            "timestamp": "3/11/2016 19:18:19",
            "amount": 15
        },
        {
            "ip": "55.55.55.55",
            "timestamp": "3/11/2016 19:18:19",
            "amount": 12
        },
    ]
    const desiredResultObject = {
        "ip": "55.55.55.55",
        "timestamp": "3/11/2016 19:18:19",
        "amount": 15
    }

    expect(handleSortedData(givenArray)).toEqual(desiredResultObject)
})

test("To checking case of same amount in same period that allows earliest entry of ip in that case", () => {
    const givenArray = [
        {
            "ip": "55.55.55.55",
            "timestamp": "3/11/2016 19:04:19",
            "amount": 11.25
        },
        {
            "ip": "55.55.55.55",
            "timestamp": "3/11/2016 19:04:02",
            "amount": 11.25
        },
        {
            "ip": "55.55.55.55",
            "timestamp": "3/11/2016 19:54:19",
            "amount": 11.25
        },
        {
            "ip": "55.55.55.55",
            "timestamp": "3/11/2016 19:18:19",
            "amount": 11.25
        },
    ]
    const desiredResultObject = {
        "ip": "55.55.55.55",
        "timestamp": "3/11/2016 19:04:02",
        "amount": 11.25
    }

    expect(handleSortedData(givenArray)).toEqual(desiredResultObject)
})

test("To check whether output object contains all the three properties or not" , () => {
    const givenArray = [
        {
            "ip": "55.55.55.55",
            "timestamp": "3/11/2016 19:04:19",
            "amount": 11.25
        },
        {
            "ip": "55.55.55.55",
            "timestamp": "3/11/2016 19:04:02",
            "amount": 5
        }
    ]
    expect(handleSortedData(givenArray)).toHaveProperty("ip", "timestamp","amount")
})