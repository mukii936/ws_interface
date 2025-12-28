    SendNUIMessage({
    event = 'economyData',
    data = {
        show = true,
    }
})

SendNUIMessage({
    event = 'openPriceList',
    data = {
        show = true,
    }
})


SendNUIMessage({
    event = 'openPriceList',
    data = {
        category = {
            {
                itemName = '',
                label = '',
                sub = 'Ăn cho vui chứ no đéo đâu.',
                price = 1000,
                imgUrl = 'https://cdn.watermelonstudio.tech/uploads/ws/noimg.svg',
                status = false,
            },
            {
                itemName = '',
                label = '',
                sub = 'Ăn cho vui chứ no đéo đâu.',
                price = 1000,
                imgUrl = 'https://cdn.watermelonstudio.tech/uploads/ws/noimg.svg',
                status = true,
            },
        },
    }
})

RegisterNUICallback('closeEconomy', function(_, cb)
    cb('ok')
end)

RegisterNUICallback('sellItem', function(data, cb)
    print(json.encode(data))
    cb('ok')
end)

RegisterNUICallback('sellItemAll', function(data, cb)
    print(json.encode(data))
    cb('ok')
end)