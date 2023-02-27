function parse_cookie(cookie) {
    if(!cookie) return {};
    const parsed_cookies = {};
    const items = cookie.split(';');
    for(const item of items) {
      const parts = item.split('=');
      const key = parts[0].trim();
      const val = parts[1] || '';
      parsed_cookies[key] = val.trim();
    }
    return parsed_cookies;
}

export default parse_cookie;