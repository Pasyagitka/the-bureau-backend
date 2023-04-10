--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: equipment_mounting_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.equipment_mounting_enum AS ENUM (
    'Пол',
    'Стена'
);


ALTER TYPE public.equipment_mounting_enum OWNER TO postgres;

--
-- Name: rental_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rental_status_enum AS ENUM (
    'InProcessing',
    'Approved',
    'Closed'
);


ALTER TYPE public.rental_status_enum OWNER TO postgres;

--
-- Name: request_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.request_status_enum AS ENUM (
    'InProcessing',
    'Completed',
    'Approved'
);


ALTER TYPE public.request_status_enum OWNER TO postgres;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'Client',
    'Brigadier',
    'Admin'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accessory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accessory (
    id integer NOT NULL,
    sku text,
    name text NOT NULL,
    "deletedAt" timestamp without time zone,
    "equipmentId" integer,
    price numeric(6,2) DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE public.accessory OWNER TO postgres;

--
-- Name: accessory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accessory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accessory_id_seq OWNER TO postgres;

--
-- Name: accessory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accessory_id_seq OWNED BY public.accessory.id;


--
-- Name: address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address (
    id integer NOT NULL,
    country text DEFAULT 'Беларусь'::text NOT NULL,
    city text NOT NULL,
    street text NOT NULL,
    house integer NOT NULL,
    corpus text,
    flat integer,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.address OWNER TO postgres;

--
-- Name: address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.address_id_seq OWNER TO postgres;

--
-- Name: address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.address_id_seq OWNED BY public.address.id;


--
-- Name: brigadier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brigadier (
    id integer NOT NULL,
    firstname text NOT NULL,
    surname text NOT NULL,
    patronymic text NOT NULL,
    "contactNumber" text NOT NULL,
    "isApproved" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp without time zone,
    "userId" integer
);


ALTER TABLE public.brigadier OWNER TO postgres;

--
-- Name: brigadier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brigadier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.brigadier_id_seq OWNER TO postgres;

--
-- Name: brigadier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brigadier_id_seq OWNED BY public.brigadier.id;


--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id integer NOT NULL,
    firstname text NOT NULL,
    surname text NOT NULL,
    patronymic text NOT NULL,
    "contactNumber" text NOT NULL,
    "deletedAt" timestamp without time zone,
    "userId" integer
);


ALTER TABLE public.client OWNER TO postgres;

--
-- Name: client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_id_seq OWNER TO postgres;

--
-- Name: client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_id_seq OWNED BY public.client.id;


--
-- Name: equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment (
    id integer NOT NULL,
    type text NOT NULL,
    mounting public.equipment_mounting_enum DEFAULT 'Пол'::public.equipment_mounting_enum NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.equipment OWNER TO postgres;

--
-- Name: equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.equipment_id_seq OWNER TO postgres;

--
-- Name: equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;


--
-- Name: request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request (
    id integer NOT NULL,
    "registerDate" timestamp without time zone DEFAULT now() NOT NULL,
    "mountingDate" date,
    comment text,
    status public.request_status_enum DEFAULT 'InProcessing'::public.request_status_enum NOT NULL,
    "deletedAt" timestamp without time zone,
    "addressId" integer,
    "brigadierId" integer,
    "clientId" integer,
    "stageId" integer
);


ALTER TABLE public.request OWNER TO postgres;

--
-- Name: request_equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_equipment (
    id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "deletedAt" timestamp without time zone,
    "equipmentId" integer,
    "requestId" integer
);


ALTER TABLE public.request_equipment OWNER TO postgres;

--
-- Name: request_equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_equipment_id_seq OWNER TO postgres;

--
-- Name: request_equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_equipment_id_seq OWNED BY public.request_equipment.id;


--
-- Name: request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_id_seq OWNER TO postgres;

--
-- Name: request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_id_seq OWNED BY public.request.id;


--
-- Name: request_report; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_report (
    id integer NOT NULL,
    file text NOT NULL,
    "deletedAt" timestamp without time zone,
    "requestId" integer,
    "brigadierId" integer
);


ALTER TABLE public.request_report OWNER TO postgres;

--
-- Name: request_report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_report_id_seq OWNER TO postgres;

--
-- Name: request_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_report_id_seq OWNED BY public.request_report.id;


--
-- Name: schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule (
    id integer NOT NULL,
    "modifiedDate" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "brigadierId" integer,
    "requestId" integer
);


ALTER TABLE public.schedule OWNER TO postgres;

--
-- Name: schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.schedule_id_seq OWNER TO postgres;

--
-- Name: schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_id_seq OWNED BY public.schedule.id;


--
-- Name: stage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stage (
    id integer NOT NULL,
    stage text NOT NULL
);


ALTER TABLE public.stage OWNER TO postgres;

--
-- Name: stage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stage_id_seq OWNER TO postgres;

--
-- Name: stage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stage_id_seq OWNED BY public.stage.id;


--
-- Name: tool; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tool (
    id integer NOT NULL,
    name text NOT NULL,
    "deletedAt" timestamp without time zone,
    "stageId" integer,
    quantity_total integer DEFAULT 0 NOT NULL,
    quantity_in_stock integer DEFAULT 0 NOT NULL,
    rental_price numeric(6,2) DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE public.tool OWNER TO postgres;

--
-- Name: tool_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tool_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tool_id_seq OWNER TO postgres;

--
-- Name: tool_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tool_id_seq OWNED BY public.tool.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    login text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "resetPasswordLink" text,
    "activationLink" text,
    "temporaryPassword" text,
    "isActivated" boolean DEFAULT false NOT NULL,
    role public.user_role_enum DEFAULT 'Client'::public.user_role_enum NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: accessory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accessory ALTER COLUMN id SET DEFAULT nextval('public.accessory_id_seq'::regclass);


--
-- Name: address id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);


--
-- Name: brigadier id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brigadier ALTER COLUMN id SET DEFAULT nextval('public.brigadier_id_seq'::regclass);


--
-- Name: client id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client ALTER COLUMN id SET DEFAULT nextval('public.client_id_seq'::regclass);


--
-- Name: equipment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);


--
-- Name: request id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request ALTER COLUMN id SET DEFAULT nextval('public.request_id_seq'::regclass);


--
-- Name: request_equipment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_equipment ALTER COLUMN id SET DEFAULT nextval('public.request_equipment_id_seq'::regclass);


--
-- Name: request_report id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_report ALTER COLUMN id SET DEFAULT nextval('public.request_report_id_seq'::regclass);


--
-- Name: schedule id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule ALTER COLUMN id SET DEFAULT nextval('public.schedule_id_seq'::regclass);


--
-- Name: stage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stage ALTER COLUMN id SET DEFAULT nextval('public.stage_id_seq'::regclass);


--
-- Name: tool id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool ALTER COLUMN id SET DEFAULT nextval('public.tool_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: accessory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accessory (id, sku, name, "deletedAt", "equipmentId", price) FROM stdin;
3	\N	Болт	\N	3	0.00
4	11331	Гайка	\N	4	0.00
2	\N	Гайка	\N	3	0.00
5		Пресс-муфта	\N	2	0.00
6	\N	Трубааа	2022-12-21 14:51:03.414241	3	0.00
7	string	string	\N	1	0.00
1	string	string	\N	2	0.00
10	\N	sswfwefwef	\N	1	0.00
11	\N	sswfwefwef	\N	1	0.00
12	\N	wefwef	\N	1	0.00
13	\N	ergergerg	\N	1	0.00
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.address (id, country, city, street, house, corpus, flat, "deletedAt") FROM stdin;
1	Belarus	Минск	Черниговская	5	\N	\N	\N
2	Belarus	Гродно	Советская	818	\N	\N	\N
35	Belarus	Минск	Рижская	77	а	22	\N
36	Belarus	Минск	аоаоа	5	а	88	\N
\.


--
-- Data for Name: brigadier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brigadier (id, firstname, surname, patronymic, "contactNumber", "isApproved", "deletedAt", "userId") FROM stdin;
1	Егор	Егоров	Егорович	375446352712	f	\N	3
2	Бригадир	Бригадиров	Бригад	375446352713	f	\N	4
3	енвевк	Цыкуыыу	екевмроиол	375446352713	f	\N	5
4	имя	фамилия	пнгпн	375447586976	f	\N	8
5	brigadier6	brigadier6	brigadier6	375445657565	f	\N	9
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, firstname, surname, patronymic, "contactNumber", "deletedAt", "userId") FROM stdin;
2	Алексей	Алексеев	Алексеевич	375446782833	\N	6
3	Андрей	Андреев	Андреевич	375446788882	\N	7
1	клукеркер	клиент1	клиент1	375445634337	\N	2
4	4444	string	string	+375445678695	\N	10
\.


--
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipment (id, type, mounting, "deletedAt") FROM stdin;
1	Радиатор напольный	Пол	\N
2	Конвектор внутрипольный	Пол	\N
3	Радиатор настенный	Стена	\N
4	Конвектор настенный	Стена	\N
5	уцацуацуацуауа	Пол	2022-12-21 13:28:08.253777
\.


--
-- Data for Name: request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request (id, "registerDate", "mountingDate", comment, status, "deletedAt", "addressId", "brigadierId", "clientId", "stageId") FROM stdin;
2	2022-12-21 13:16:46.682945	2022-12-22	ощшпуо	InProcessing	\N	2	2	2	2
1	2022-12-21 13:06:18.488413	2022-12-22	Частный дом	InProcessing	\N	1	1	1	2
35	2022-12-21 13:27:52.050773	2022-12-23	Код от домофона - 1488	Completed	\N	35	2	2	1
36	2022-12-21 14:53:23.453788	2022-12-22	ршрш	Completed	\N	36	1	1	3
\.


--
-- Data for Name: request_equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_equipment (id, quantity, "deletedAt", "equipmentId", "requestId") FROM stdin;
1	1	\N	2	1
2	2	\N	3	1
3	3	\N	3	2
4	2	\N	4	2
36	1	\N	1	35
37	2	\N	3	35
38	5	\N	2	36
39	2	\N	3	36
\.


--
-- Data for Name: request_report; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_report (id, file, "deletedAt", "requestId", "brigadierId") FROM stdin;
1	i	\N	1	1
2	ergerg	2022-12-21 13:17:02.833	1	2
\.


--
-- Data for Name: schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule (id, "modifiedDate", "deletedAt", "brigadierId", "requestId") FROM stdin;
2	2022-12-21 13:16:58.974247	\N	2	2
1	2022-12-21 13:06:29.573892	2022-12-21 13:17:02.833219	2	1
3	2022-12-21 13:17:02.853318	\N	1	1
35	2022-12-21 13:28:22.65024	\N	2	35
36	2022-12-21 14:53:41.234152	\N	1	36
\.


--
-- Data for Name: stage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stage (id, stage) FROM stdin;
1	Чистовая
2	Черновая
3	Обе
\.


--
-- Data for Name: tool; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tool (id, name, "deletedAt", "stageId", quantity_total, quantity_in_stock, rental_price) FROM stdin;
1	Перфоратор	\N	2	0	0	0.00
2	Рулетка	\N	3	0	0	0.00
4	Молоток	\N	3	0	0	0.00
5	Линейка	\N	3	0	0	0.00
6	t2r3443t	2022-12-21 13:25:42.606261	2	0	0	0.00
3	Ножницs	\N	1	0	0	0.00
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, login, email, password, "resetPasswordLink", "activationLink", "temporaryPassword", "isActivated", role, "deletedAt") FROM stdin;
1	admin	lizavetazinovich@gmail.com	$2a$04$zjpv/0CdrBrCi0pjiGQkcufvu707pOX71GfMuZUeLBiZVCeVmblqC	\N	\N	\N	t	Admin	\N
2	client1	client1@gmail.com	$2a$04$4EYhWTCZiu.QcM27.6BgBu1wg6dID8QOxN3TGTLTxPZ7jZ4XS4RHa	\N	9230c9a8-abc1-4df6-bf01-b14965ba36d5	\N	t	Client	\N
4	brigadier2	brigadier2@gmail.com	$2a$04$uKTuYJYkoWhp4zIkvfUu.elGlQtTghasUgBmSBInWkBVBMAhtmqWq	\N	b0fda5aa-81ef-4aed-ace6-21c77687491d	\N	t	Brigadier	\N
3	brigadier1	brigadier1@gmail.com	$2a$04$MsfT7yy8ZK51yRe94BcQ0uuhSQgwr1f617fqY/PguWy7jR1oaJaMK	\N	f8fded90-65dd-46d2-90e8-a48538ca8504	\N	t	Brigadier	\N
6	client2	client2@gmail.com	$2a$04$yCPypCsf0WnPGWMfvzuSa.ZLSaDVF1D8vFKO4OR6S0FYprKWvx0du	\N	b098fef5-c574-4215-837c-429653428d6b	\N	t	Client	\N
7	client3	client3@gmail.com	$2a$04$KcTVhzOY.FQ/Y03UuO9/JelvD6Z1OAsPiN3.8xSYoFzRhRPiZ3bGu	\N	28cfa972-a439-4954-9976-1dc2cf2d5b80	\N	t	Client	\N
5	brigadier3	brigadier3@gmail.com	$2a$04$CYK7AwYeQ4Qw8kg7w0XB1O6zewP9CUIg/14IHOQUkucWetjk0KRim	\N	b3dde61f-c77a-4dec-b29d-12d0dca4a810	\N	t	Brigadier	\N
8	brigadier4	brigadier4@gmail.com	$2a$04$UVHjMcJryTwAkrlq3yoSDODruNdM4X2GYo/GRIcxxMYSWWWnNeSZq	\N	cc9928a0-2fa9-490f-bb6b-bdb782f77544	\N	t	Brigadier	\N
9	brigadier6	brigadier6@gmail.com	$2a$04$KEwBy7quVqKb.IMSnw7ozOiBlUWyINOR17zzytInlgQYRSCQrnoqm	\N	542dc62b-c7ad-4d4f-abe4-b1f33a64f390	\N	t	Brigadier	\N
10	string	string@mail.ru	$2a$04$V2WEH6jUQRAFe79..uf1auTFMLWe9O1y5xRPrtNUHaEpiTl4yZpZS	\N	f998dbef-397b-4716-82b5-ffba7b457be0	\N	t	Client	\N
\.


--
-- Name: accessory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accessory_id_seq', 13, true);


--
-- Name: address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_id_seq', 36, true);


--
-- Name: brigadier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brigadier_id_seq', 5, true);


--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_seq', 4, true);


--
-- Name: equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipment_id_seq', 5, true);


--
-- Name: request_equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_equipment_id_seq', 39, true);


--
-- Name: request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_id_seq', 36, true);


--
-- Name: request_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_report_id_seq', 1, true);


--
-- Name: schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_id_seq', 36, true);


--
-- Name: stage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stage_id_seq', 3, true);


--
-- Name: tool_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tool_id_seq', 6, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 10, true);


--
-- Name: equipment PK_0722e1b9d6eb19f5874c1678740; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT "PK_0722e1b9d6eb19f5874c1678740" PRIMARY KEY (id);


--
-- Name: request_report PK_0c224d3c050ff241390da56f127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_report
    ADD CONSTRAINT "PK_0c224d3c050ff241390da56f127" PRIMARY KEY (id);


--
-- Name: request PK_167d324701e6867f189aed52e18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY (id);


--
-- Name: schedule PK_1c05e42aec7371641193e180046; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY (id);


--
-- Name: tool PK_3bf5b1016a384916073184f99b7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool
    ADD CONSTRAINT "PK_3bf5b1016a384916073184f99b7" PRIMARY KEY (id);


--
-- Name: client PK_96da49381769303a6515a8785c7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY (id);


--
-- Name: stage PK_c54d11b3c24a188262844af1612; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stage
    ADD CONSTRAINT "PK_c54d11b3c24a188262844af1612" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: address PK_d92de1f82754668b5f5f5dd4fd5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY (id);


--
-- Name: accessory PK_e1ead99f958789eeebd86246d74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accessory
    ADD CONSTRAINT "PK_e1ead99f958789eeebd86246d74" PRIMARY KEY (id);


--
-- Name: request_equipment PK_f4a3936de545920cfe2138617be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_equipment
    ADD CONSTRAINT "PK_f4a3936de545920cfe2138617be" PRIMARY KEY (id);


--
-- Name: brigadier PK_fddf0c0ff18caff7fd4c294be51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brigadier
    ADD CONSTRAINT "PK_fddf0c0ff18caff7fd4c294be51" PRIMARY KEY (id);


--
-- Name: request REL_3782dc6d12e6e474d8bab1d080; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "REL_3782dc6d12e6e474d8bab1d080" UNIQUE ("addressId");


--
-- Name: client REL_ad3b4bf8dd18a1d467c5c0fc13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "REL_ad3b4bf8dd18a1d467c5c0fc13" UNIQUE ("userId");


--
-- Name: brigadier REL_c4e9124b1ee7a27d9fd2c3d8d7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brigadier
    ADD CONSTRAINT "REL_c4e9124b1ee7a27d9fd2c3d8d7" UNIQUE ("userId");


--
-- Name: user UQ_a62473490b3e4578fd683235c5e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE (login);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: Equipment_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Equipment_pkey" ON public.equipment USING btree (id);


--
-- Name: accessory_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX accessory_pkey ON public.accessory USING btree (id);


--
-- Name: address_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX address_pkey ON public.address USING btree (id);


--
-- Name: brigadier_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX brigadier_pkey ON public.brigadier USING btree (id);


--
-- Name: client_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX client_pkey ON public.client USING btree (id);


--
-- Name: request_equipment_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX request_equipment_pkey ON public.request_equipment USING btree (id);


--
-- Name: request_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX request_pkey ON public.request USING btree (id);


--
-- Name: request_report_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX request_report_pkey ON public.request_report USING btree (id);


--
-- Name: schedule_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX schedule_pkey ON public.schedule USING btree (id);


--
-- Name: stage_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX stage_pkey ON public.stage USING btree (id);


--
-- Name: tool_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tool_pkey ON public.tool USING btree (id);


--
-- Name: user_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_pkey ON public."user" USING btree (id);


--
-- Name: request FK_093c2cacb1cede069dab9e65fde; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "FK_093c2cacb1cede069dab9e65fde" FOREIGN KEY ("stageId") REFERENCES public.stage(id);


--
-- Name: request FK_3782dc6d12e6e474d8bab1d080b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "FK_3782dc6d12e6e474d8bab1d080b" FOREIGN KEY ("addressId") REFERENCES public.address(id) ON DELETE CASCADE;


--
-- Name: request_report FK_83083584fa7b09fdd819fa0771d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_report
    ADD CONSTRAINT "FK_83083584fa7b09fdd819fa0771d" FOREIGN KEY ("requestId") REFERENCES public.request(id);


--
-- Name: request_report FK_8e5c322972abbb979259f37b376; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_report
    ADD CONSTRAINT "FK_8e5c322972abbb979259f37b376" FOREIGN KEY ("brigadierId") REFERENCES public.brigadier(id);


--
-- Name: client FK_ad3b4bf8dd18a1d467c5c0fc13a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "FK_ad3b4bf8dd18a1d467c5c0fc13a" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: request_equipment FK_c2e6f5443cd62a4db7ee5515eb8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_equipment
    ADD CONSTRAINT "FK_c2e6f5443cd62a4db7ee5515eb8" FOREIGN KEY ("equipmentId") REFERENCES public.equipment(id);


--
-- Name: schedule FK_c42cd2920265cb7a385f2e99e4c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT "FK_c42cd2920265cb7a385f2e99e4c" FOREIGN KEY ("requestId") REFERENCES public.request(id);


--
-- Name: brigadier FK_c4e9124b1ee7a27d9fd2c3d8d70; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brigadier
    ADD CONSTRAINT "FK_c4e9124b1ee7a27d9fd2c3d8d70" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: request_equipment FK_c91a8f29b64d2106ff429041e43; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_equipment
    ADD CONSTRAINT "FK_c91a8f29b64d2106ff429041e43" FOREIGN KEY ("requestId") REFERENCES public.request(id);


--
-- Name: schedule FK_cdeba1cf912253419bb09448e01; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT "FK_cdeba1cf912253419bb09448e01" FOREIGN KEY ("brigadierId") REFERENCES public.brigadier(id);


--
-- Name: accessory FK_d1fe25c8452a77e3513437d4e7b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accessory
    ADD CONSTRAINT "FK_d1fe25c8452a77e3513437d4e7b" FOREIGN KEY ("equipmentId") REFERENCES public.equipment(id);


--
-- Name: request FK_df30188ff79f9f7637e159a739f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "FK_df30188ff79f9f7637e159a739f" FOREIGN KEY ("clientId") REFERENCES public.client(id);


--
-- Name: tool FK_e11e3f20a86dc84bd996bbd9f57; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool
    ADD CONSTRAINT "FK_e11e3f20a86dc84bd996bbd9f57" FOREIGN KEY ("stageId") REFERENCES public.stage(id);


--
-- Name: request FK_ffe66307105b8f490ed5d0ddad5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "FK_ffe66307105b8f490ed5d0ddad5" FOREIGN KEY ("brigadierId") REFERENCES public.brigadier(id);


--
-- PostgreSQL database dump complete
--

