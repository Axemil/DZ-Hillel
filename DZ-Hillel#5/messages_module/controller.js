const { join } = require("path");

exports.get_main_page = (req, res, next) => {
  const { messages } = res.app.locals;
  res.render("index", { title: "Main page", messages: messages });
};

exports.get_file = (req, res, next) => {
  const options = {
    root: join(__dirname, "public"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  const fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
};

exports.get_messages = (req, res, next) => {
  res.send(
    res.app.locals.messages.map(({ id, text, user, date }) => ({
      id,
      text,
      user,
      date,
    }))
  );
};

exports.get_message_by_id = (req, res, next) => {
  const { id } = req.params;
  if (Number.isInteger(parseInt(id, 10))) {
    res.send(
      res.app.locals.messages.filter(
        ({ id, text, user, date }) =>
          id == req.params.id && { id, text, user, date }
      )
    );
  }
};

exports.get_messages_by_sort = (req, res, next) => {
  let { sort, sortValue, limit, skip } = req.params;
  const { messages } = res.app.locals;
  limit = parseInt(limit, 10);
  skip = parseInt(skip, 10);

  Number.isInteger(parseInt(sort, 10)) && (sort = "date");
  Number.isInteger(parseInt(sortValue, 10)) && (sortValue = "desc");
  !Number.isInteger(limit) && (limit = 10);
  !Number.isInteger(skip) && (skip = 0);

  const limited_array = messages.slice(skip, limit);


  const byField = (field) => {
    if(sortValue === 'desc') {
      return (a, b) => a[field] > b[field] ? 1 : -1;
    }
    else if(sortValue === 'asc'){
      return (a, b) => a[field] < b[field] ? 1 : -1;
    }
  }

  res.send({
    sort: sort,
    sortValue: sortValue,
    skip: skip,
    limit: limit,
    array: limited_array.sort(byField(sort)),
  });
};

exports.add_message = (req, res, next) => {
  const { messages } = res.app.locals;
  messages.push({ id: messages.length + 1, ...req.body, date: new Date() });
  res.json(messages[messages.length - 1]);
};

exports.delete_all_messages = (req, res, next) => {
  res.app.locals.messages = [];
  res.json({ message: "All messages were deleted" });
};

exports.delete_message_by_id = (req, res, next) => {
  const { messages } = res.app.locals;
  const { id } = req.params;
  const message = messages[id];
  messages.splice(id, 1);
  res.json(message);
};

exports.update_message_by_id = (req, res, next) => {
  const { messages } = res.app.locals;
  const { text } = req.body;
  const { id } = req.params;

  const message = messages.find((message, index, array) => {
    if (index == id) {
      return message;
    }
  });
  if (!message) {
    return next({ code: 404, message: "not found" });
  }
  Object.assign(message, { text, updatedAt: new Date() });
  res.json(message);
};
