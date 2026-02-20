obs = obslua

local json_path = script_path() .. "../overlay/config/overlay.json"

local current_sr       = 0
local current_user     = "@USERNAME"
local current_opacity  = 0.85
local current_bg       = "classic-dark"

local function write_json()
    local file = io.open(json_path, "w")
    if file then
        local json = string.format(
[[{
    "sr": %d,
    "username": "%s",
    "opacity": %.2f,
    "background": "%s"
}]], current_sr, current_user, current_opacity, current_bg)

        file:write(json)
        file:close()
    end
end

local function btn_update(props, p)
    write_json()
    return true
end

function script_properties()
    local props = obs.obs_properties_create()

    obs.obs_properties_add_text(props, "username", "Activision Username", obs.OBS_TEXT_DEFAULT)
    obs.obs_properties_add_int(props, "sr", "SR", 0, 100000, 1)

    obs.obs_properties_add_float_slider(props, "opacity", "Background Opacity", 0.0, 1.0, 0.01)

    local bg_list = obs.obs_properties_add_list(
        props, "background", "Background Template",
        obs.OBS_COMBO_TYPE_LIST, obs.OBS_COMBO_FORMAT_STRING
    )
    obs.obs_property_list_add_string(bg_list, "Classic Dark", "classic-dark")
    obs.obs_property_list_add_string(bg_list, "Dark Glass", "dark-glass")
    obs.obs_property_list_add_string(bg_list, "Neon Grid", "neon-grid")
    obs.obs_property_list_add_string(bg_list, "Cyber Wave", "cyber-wave")
    obs.obs_property_list_add_string(bg_list, "Matrix", "matrix")
    obs.obs_property_list_add_string(bg_list, "Aurora", "aurora")
    obs.obs_property_list_add_string(bg_list, "Crimson Flame", "crimson-flame")
    obs.obs_property_list_add_string(bg_list, "Frozen Ice", "frozen-ice")
    obs.obs_property_list_add_string(bg_list, "Marble White", "marble-white")

    obs.obs_properties_add_button(props, "update", "Force Update JSON", btn_update)

    return props
end

function script_update(settings)
    current_sr      = obs.obs_data_get_int(settings, "sr")
    current_user    = obs.obs_data_get_string(settings, "username")
    current_opacity = obs.obs_data_get_double(settings, "opacity")
    current_bg      = obs.obs_data_get_string(settings, "background")
    write_json()
end

function script_defaults(settings)
    obs.obs_data_set_default_int(settings, "sr", 0)
    obs.obs_data_set_default_string(settings, "username", "@USERNAME")
    obs.obs_data_set_default_double(settings, "opacity", 0.85)
    obs.obs_data_set_default_string(settings, "background", "classic-dark")
end

function script_description()
    return "FearVanta Ranked Overlay\nHorizontal-only BO7 ranked overlay with SR, Username, Background Template, and Opacity.";
end
