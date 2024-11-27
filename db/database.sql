alter table usuario add column nome varchar (200) not null;
alter table usuario add column email varchar (200) not null;
alter table usuario add column senha varchar (100) not null;
alter table usuario add column access_token varchar (200) null;

--colunas para excluir
alter table usuario drop column info;
alter table usuario drop column permissao;
alter table usuario drop column grupo;
alter table usuario drop column cargo;

-- Sistema
create table sistema(
  id serial not null,
  sisnome varchar(200) not null,
  sisativo int not null default 1
)

-- Profiles
-- "profiles": [
--     {
--       "codigo": 1,
--       "nome": "Admin",
--       "siscodigo": null,
--       "permissions": {
--         "index": true,
--         "update": true,
--         "insert": true,
--         "delete": true
--       },
--       "id": 1
--     }







