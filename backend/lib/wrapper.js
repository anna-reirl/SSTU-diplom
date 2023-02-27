/* Module for routes safe wrapping */

function http_safe_wrap(func){
  return async function(req, res){
      try{
          await func(req, res);
      }
      catch(err){
        console.log(err);
        const err_message = (err.name === "AlertError") ? err.message : "Error during process!";
        if(err.name === "TokenExpiredError" || err.message === "invalid signature") {
          res.clearCookie("token");
          return res.status(401).json({err_message});
        }
        res.status(400).json({err_message});
      }
  }
}


export { http_safe_wrap};