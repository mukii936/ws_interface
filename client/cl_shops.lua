SendNUIMessage({
    event = 'shopData',
    data = {
        show = true,
        labelShopName = 'CỬA HÀNG TẠP HOÁ',
        subShop = 'Cái đéo gì cũng bán trừ tình yêu.',
    }
})

SendNUIMessage({
    event = 'shopCategoryData',
    data = {
        category = {
            {
                itemName = 'water_bottle',
                label = 'HAMBURGER',
                sub = 'Ăn cho vui chứ no đéo đâu.',
                price = 10,
                imgUrl = 'https://cdn.watermelonstudio.tech/uploads/ws/noimg.svg',
            }
        }
    }
})

RegisterNUICallback('buyItems', function(data, cb)
    print(data.itemName, data.price, data.count, data.type)
    cb('ok')
end)

RegisterNUICallback('closeShop', function(_, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)