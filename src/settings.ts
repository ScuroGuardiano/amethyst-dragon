export default {
    BANNERS_PER_SERVER: 5,
    MAX_BACKGROUND_WIDTH: 2048,
    MAX_BACKGROUND_HEIGHT: 2048,
    MAX_AVATAR_WIDTH: 2048,
    MAX_AVATAR_HEIGHT: 2048,
    MAX_BACKGROUND_SIZE: 10485760,
    MAX_CAPTIONS_PER_BANNER: 3,
    MAX_BORDERS_PER_CAPTION: 10,
    MAX_BANNER_BORDERS: 10,
    MAX_AVATAR_BORDERS: 10,
    ALLOWED_FONT_FAMILIES: [ 'sans-serif' ],
    ALLOWED_CONTENT_TYPES: [ 'image/png', 'image/jpeg' ],
    MAX_FONT_SIZE: 200,
    TEXT_CHARACTERS_LIMIT: 32,
    MAX_CAPTION_WIDTH: 2048,
    // https://stackoverflow.com/a/43706299
    COLOR_VALIDATION_REGEX: /^(\#[\da-f]{3}|\#[\da-f]{6}|rgba\(((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*,\s*){2}((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*)(,\s*(0\.\d+|1))\)|hsla\(\s*((\d{1,2}|[1-2]\d{2}|3([0-5]\d|60)))\s*,\s*((\d{1,2}|100)\s*%)\s*,\s*((\d{1,2}|100)\s*%)(,\s*(0\.\d+|1))\)|rgb\(((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*,\s*){2}((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*)|hsl\(\s*((\d{1,2}|[1-2]\d{2}|3([0-5]\d|60)))\s*,\s*((\d{1,2}|100)\s*%)\s*,\s*((\d{1,2}|100)\s*%)\))$/
}
