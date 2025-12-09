local function Notify(title, message, time, type, icon)
	if not icon then
		icon = 'fas fa-bell'
	end
	SendNUIMessage({
        event = 'NotifyData',
        data = {
			title = title,
			type = type,
			message = message,
			time = time,
			icon = icon
        }
    })
end

RegisterNetEvent('ws_interface:Notify')
AddEventHandler('ws_interface:Notify', function(title, icon, message, time, type, icon)
	Notify(title, icon, message, time, type, icon)
end)

exports('Notify', Notify)

-- RegisterCommand('success', function()
-- 	exports['ws_interface']:Notify("THÀNH CÔNG", "You have sent <span style='color:#47cf73'>420€</span> to Tommy!", 5000000, 'success')
-- end)

-- RegisterCommand('info', function()
-- 	exports['ws_interface']:Notify("THÔNG TIN", "","The Casino has opened!", 5000, 'info')
-- end)

-- RegisterCommand('error', function()
-- 	exports['ws_interface']:Notify("THẤT BẠI" ,"Please try again later!", 5000, 'error')
-- end)

-- RegisterCommand('warning', function()
-- 	exports['ws_interface']:Notify("CẢNH BÁO", "","You are getting nervous!", 5000, 'warning')
-- end)

-- RegisterCommand('longtext', function()
-- 	exports['ws_interface']:Notify("DÀI VÃI LỒN", "","Lorem ipsum dolor sit amet, consectetur adipiscing elit e pluribus unum.", 5000, 'neutral')
-- end)
