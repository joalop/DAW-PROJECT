drop database if exists managebd;

create database managebd;
use managebd;

/* --------------------- ----------------- -------------*/

drop table if exists permisos_usuarios;

create table permisos_usuarios(
id_permiso_usuario int primary key,
nombre varchar(20) not null);

insert into permisos_usuarios ( id_permiso_usuario, nombre ) values (1, 'ADMINISTRATOR');
insert into permisos_usuarios ( id_permiso_usuario, nombre ) values (2, 'USER');

/* --------------------- ----------------- -------------*/

drop table if exists usuarios;

create table usuarios(
id_usuario INT primary key auto_increment,
nombre varchar(20),
apellidos varchar(60),
usuario_chat varchar(20),
email varchar(60),
contrasenya varchar(200),
permisos int not null,
fecha_creacion date,
vigencia date,
constraint fk_usuario_permisos foreign key (permisos) references permisos_usuarios(id_permiso_usuario) );

insert into usuarios ( id_usuario, nombre, apellidos, usuario_chat, email, contrasenya, permisos, fecha_creacion, vigencia )
values ( null, 'admin', 'administrator', 'admin00', 'admin@gmail.com', '$2b$10$/3BeOVc110JVhWMYKEKOdeI7mX40HU2qd3LZ4yMvs5i5E3aYyTs4W', 1, null, null);