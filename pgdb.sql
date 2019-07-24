--
-- PostgreSQL database dump
--

-- Dumped from database version 10.7
-- Dumped by pg_dump version 11.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: pelit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pelit (
    id text NOT NULL,
    data json
);


ALTER TABLE public.pelit OWNER TO postgres;

--
-- Data for Name: pelit; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Name: pelit pelit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pelit
    ADD CONSTRAINT pelit_pkey PRIMARY KEY (id);




