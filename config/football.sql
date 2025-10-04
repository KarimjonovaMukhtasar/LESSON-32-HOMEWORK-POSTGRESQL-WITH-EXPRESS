create database football;
create table football_clubs(id serial primary key, 
        club_name varchar(100) not null,
        city varchar(100) not null,
        country varchar(100) not null,
        founded_year int);

select * from football_clubs;

create table tournaments(id serial primary key,
        tournament_name varchar(100) not null,
        start_date date not null,
        end_date date not null,
        status varchar(20) not null);

select * from tournaments;
create table tournament_groups(id serial primary key,
    group_name varchar(100) not null,
    tournamnt_id int REFERENCES tournaments(id) on delete CASCADE);

create table teams(id serial primary key,
    team_name varchar(100) not null,
    club_id int REFERENCES football_clubs(id) on delete CASCADE ,
    group_id int REFERENCES tournament_groups(id) on delete CASCADE,
    coach_name varchar(100));

select * from teams;

create table match_fixtures(id serial primary key,
        match_date timestamp not null,
        venue varchar(100),
        home_team_id int REFERENCES teams(id) on delete CASCADE,
        away_team_id int REFERENCES teams(id) on delete CASCADE,
        home_score int,
        away_score int,
        tournament_id int REFERENCES tournaments(id) on delete CASCADE,
        match_status varchar(20));
select * from match_fixtures;
create table players(id SERIAL PRIMARY key,
        full_name varchar(100) not null,
        date_of_birth date not null,
        position varchar(50) not null,
        team_id int references teams(id) on delete CASCADE);

select * from players;