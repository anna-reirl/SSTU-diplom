const AlertError = require("./AlertError");
const {API_HOSTNAME} = require("../config/constants");

function build_api(methods, router){
    const api = {};

    let query_func = ([method, http_method], params={}) =>{
        if(!http_method) throw new Error("Wrong HTTP method!");
        if(http_method === "GET") {
            let url = `${API_HOSTNAME}/${method}`;
            const params_keys = Object.keys(params);
            if(params_keys.length) url += "?";
            for(const param of params_keys){
                if(!url.endsWith("?")) url += "&"; 
                url += `${param}=${encodeURI(params[param])}`
            }
            return fetch(url);
        }
        // POST query
        else{ 
            const url = `${API_HOSTNAME}/${method}`;
            return fetch(url, {
                method: "POST", 
                body: JSON.stringify(params),
                headers: {"Content-Type": "application/json"}
            });
        }
    }

    for(const [method, http_method] of methods){
        api[method] = async(params={}) => {
            const response = await query_func([method, http_method], params);
            if(response.status === 401) {
                router.push({name: "Sign In"});
                throw new Error("Need sign in!");
            }
            const data = await response.json();
            if(!response.ok) throw new AlertError(data.err_message);
            return data;
        }
    }
    
    return api;
}

module.exports = {build_api};