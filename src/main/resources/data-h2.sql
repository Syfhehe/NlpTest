MERGE INTO user (user_name, password, active, role) 
   KEY(user_name)
VALUES
  ('aaa@xxx.com', 'b8ba8c5ba8541911873b459e3db2aee3', true, 'ADMIN'),
  ('bbb@xxx.com', 'fbfda36443bd9923de9f5b568156a242', true, 'USER'),
  ('ccc@xxx.com', '1e85641a45ac9c9304216a6edc109b41', true, 'DEVELOPER');
