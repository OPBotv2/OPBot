router.get('/', (req, res) => {
  const commands = getAllCommands(); // aus JSON oder Datenbank
  res.render('commands', { user: req.user, commands });
});
