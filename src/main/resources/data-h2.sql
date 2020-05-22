MERGE INTO user (user_name, password, active, role) 
   KEY(user_name)
VALUES
  ('aaa@test.com', 'dcc4072993a386d936506857c54060dc', true, 'ADMIN'),
  ('bbb@test.com', '1c9f57b789f04333424a599e087ed889', true, 'USER'),
  ('ccc@test.com', '2c14ecc1d818e4417433d800e318d37d', true, 'DEVELOPER');

INSERT INTO settings(NAME, VAL) values ('threshold', '1');
INSERT INTO settings(NAME, VAL) values ('visitTimes', '10');


INSERT INTO Sensitivity(word_name, word_value) values ('伟大', 0.2);
