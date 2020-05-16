
exports.check_number = (req, res, next) =>  {
  const { id } = req.params;
  const id_number = parseInt(id, 10);
  if( Number.isInteger(id_number) ){
    next()
  }
  else{
    res.json({ message: 'Не верный id' })
  }
}

exports.check_body = (req, res, next) => {
  if(!req.body){
    res.json({message: 'Body not found!'})
  }
  let { user, text } = req.body;
  user = user.toString();
  if(user.match(/^\d+$/)){
    res.json({message: 'Не верное имя юзера'})
  }
  else{
    next();
  }
}

