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
    'Accepted',
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
    "equipmentId" integer,
    price numeric(6,2) DEFAULT '0'::numeric NOT NULL,
    quantity_in_stock integer DEFAULT 0 NOT NULL,
    "deletedAt" timestamp with time zone
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
    city text NOT NULL,
    street text NOT NULL,
    flat integer,
    "deletedAt" timestamp with time zone,
    lat text,
    lon text,
    house text
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
    "userId" integer NOT NULL,
    "deletedAt" timestamp with time zone,
    "avatarUrl" text
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
    "userId" integer NOT NULL,
    "deletedAt" timestamp with time zone
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
    "deletedAt" timestamp with time zone
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
-- Name: invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice (
    id integer NOT NULL,
    "totalPrice" numeric(6,2) DEFAULT '0'::numeric NOT NULL,
    "customerId" integer
);


ALTER TABLE public.invoice OWNER TO postgres;

--
-- Name: invoice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoice_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invoice_id_seq OWNER TO postgres;

--
-- Name: invoice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoice_id_seq OWNED BY public.invoice.id;


--
-- Name: invoice_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_item (
    id integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    price numeric(6,2) DEFAULT '0'::numeric NOT NULL,
    sum numeric(6,2) DEFAULT '0'::numeric NOT NULL,
    "invoiceId" integer,
    "accessoryId" integer
);


ALTER TABLE public.invoice_item OWNER TO postgres;

--
-- Name: invoice_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoice_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invoice_item_id_seq OWNER TO postgres;

--
-- Name: invoice_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoice_item_id_seq OWNED BY public.invoice_item.id;


--
-- Name: request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request (
    id integer NOT NULL,
    comment text,
    status public.request_status_enum DEFAULT 'InProcessing'::public.request_status_enum NOT NULL,
    "addressId" integer,
    "brigadierId" integer,
    "clientId" integer,
    "stageId" integer,
    "registerDate" timestamp with time zone DEFAULT now() NOT NULL,
    "mountingDate" date,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.request OWNER TO postgres;

--
-- Name: request_equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_equipment (
    id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "equipmentId" integer,
    "requestId" integer,
    "deletedAt" timestamp with time zone
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
    url text NOT NULL,
    "requestId" integer NOT NULL,
    "brigadierId" integer,
    "deletedAt" timestamp with time zone,
    public_id text
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
    "brigadierId" integer,
    "requestId" integer,
    "modifiedDate" timestamp with time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp with time zone
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
    stage text NOT NULL,
    "mountingPrice" numeric(6,2) DEFAULT '0'::numeric NOT NULL
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
    "stageId" integer,
    "deletedAt" timestamp with time zone
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
    "deletedAt" timestamp with time zone
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
-- Name: invoice id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice ALTER COLUMN id SET DEFAULT nextval('public.invoice_id_seq'::regclass);


--
-- Name: invoice_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_item ALTER COLUMN id SET DEFAULT nextval('public.invoice_item_id_seq'::regclass);


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

COPY public.accessory (id, sku, name, "equipmentId", price, quantity_in_stock, "deletedAt") FROM stdin;
14	string	string	1	1.00	0	\N
3	\N	Болт	3	1.00	0	\N
4	11331	Гайка	4	1.00	1	\N
2	\N	Гайка	3	2.00	0	\N
5		Пресс-муфта	2	2.00	1	\N
7	string	string	1	1.00	0	\N
10	\N	sswfwefwef	1	10.00	2	\N
11	\N	sswfwefwef	1	1.00	0	\N
12	\N	wefwef	1	1.00	0	\N
13	\N	ergergerg	1	1.00	0	\N
15	ergergerg	egerg	3	2.00	0	\N
1	wefwefwefwfe	string	2	1.00	33	\N
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.address (id, city, street, flat, "deletedAt", lat, lon, house) FROM stdin;
38	Минск	Черниговская	\N	\N	53.8628267	27.5302989	5
40	Минск	Червякова	\N	\N	53.9212048	27.5502992	3
41	Майский	Новая	\N	\N	52.9531688	30.1000025	1
42	Алексичский	Юбилейная	3233	\N	51.9354584	29.6907746	1
1	Минск	Черниговская	\N	\N	53.8628267\t27.5302989	53.8628267\t27.5302989	\N
2	Гродно	Советская	\N	\N	53.8628267\t27.5302989	53.8628267\t27.5302989	\N
37	Пашковский	Минское	\N	\N	51.9354584	29.6907746	\N
36	Минск	аоаоа	88	\N	53.8628267\t27.5302989	29.6907746	\N
35	Минск	Рижская	22	\N	53.8628267\t27.5302989	27.5302989	\N
39	Колодищанский	Агатовая	\N	\N	53.8628267	27.5302990	5
43	Минск	Черниговская	3	\N	53.8628267	27.5302989	5
44	Минск	Черниговская	55	\N	53.8628267	27.5302989	5
\.


--
-- Data for Name: brigadier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brigadier (id, firstname, surname, patronymic, "contactNumber", "isApproved", "userId", "deletedAt", "avatarUrl") FROM stdin;
2	Бригадир	Бригадиров	Бригад	375446352713	f	4	\N	\N
3	енвевк	Цыкуыыу	екевмроиол	375446352713	f	5	\N	\N
4	имя	фамилия	пнгпн	375447586976	f	8	\N	\N
5	brigadier6	brigadier6	brigadier6	375445657565	f	9	\N	\N
1	Егор	Егоров	Егорович	375446352712	f	3	\N	https://res.cloudinary.com/dblablirp/image/upload/v1681568267/brigadiersAvatars/1.png
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, firstname, surname, patronymic, "contactNumber", "userId", "deletedAt") FROM stdin;
2	Алексей	Алексеев	Алексеевич	375446782833	6	\N
3	Андрей	Андреев	Андреевич	375446788882	7	\N
4	4444	string	string	+375445678695	10	\N
1	клукерке	клиент	клиент	375445634337	2	\N
\.


--
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipment (id, type, mounting, "deletedAt") FROM stdin;
2	Конвектор внутрипольный	Пол	\N
3	Радиатор настенный	Стена	\N
4	Конвектор настенный	Стена	\N
1	Радиатор напольный1111	Стена	\N
5	уцацуацуацуауа	Пол	2023-04-16 14:54:58.603915+00
\.


--
-- Data for Name: invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice (id, "totalPrice", "customerId") FROM stdin;
1	0.00	1
2	0.00	1
3	0.00	1
4	0.00	1
5	0.00	1
6	0.00	1
7	0.00	1
8	0.00	1
9	0.00	1
10	0.00	1
11	0.00	1
12	0.00	1
13	0.00	1
14	0.00	1
15	0.00	1
16	0.00	1
17	0.00	1
18	0.00	1
19	0.00	1
20	0.00	1
21	0.00	1
22	0.00	1
23	0.00	1
24	0.00	1
25	0.00	1
26	0.00	1
27	0.00	1
28	0.00	1
29	0.00	1
30	0.00	1
31	0.00	1
32	0.00	1
33	0.00	1
34	0.00	1
35	0.00	1
36	0.00	1
37	0.00	1
38	0.00	1
39	0.00	1
40	0.00	1
41	0.00	1
42	0.00	1
43	0.00	1
44	0.00	1
45	0.00	1
46	0.00	1
47	0.00	1
48	0.00	1
49	0.00	1
50	0.00	2
\.


--
-- Data for Name: invoice_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_item (id, quantity, price, sum, "invoiceId", "accessoryId") FROM stdin;
1	1	0.00	0.00	1	1
2	1	0.00	0.00	2	1
3	1	0.00	0.00	3	1
4	1	0.00	0.00	4	1
5	1	0.00	0.00	5	1
6	1	0.00	0.00	6	1
7	1	0.00	0.00	7	1
8	1	0.00	0.00	8	1
9	1	0.00	0.00	9	1
10	1	0.00	0.00	10	1
11	1	0.00	0.00	11	1
12	1	0.00	0.00	12	1
13	1	0.00	0.00	13	1
14	1	0.00	0.00	14	1
15	1	0.00	0.00	15	1
16	1	0.00	0.00	16	1
17	1	0.00	0.00	17	1
18	1	0.00	0.00	18	1
19	1	0.00	0.00	19	1
20	1	0.00	0.00	20	1
21	1	0.00	0.00	21	1
22	1	0.00	0.00	22	1
23	1	0.00	0.00	23	1
24	1	0.00	0.00	24	1
25	1	0.00	0.00	25	1
26	1	0.00	0.00	26	1
27	1	0.00	0.00	27	1
28	1	0.00	0.00	28	1
29	1	0.00	0.00	29	1
30	1	0.00	0.00	30	1
31	1	0.00	0.00	31	1
32	1	0.00	0.00	32	1
33	1	0.00	0.00	33	1
34	1	0.00	0.00	34	1
35	1	0.00	0.00	35	1
36	1	0.00	0.00	36	1
37	1	0.00	0.00	37	1
38	1	0.00	0.00	38	1
39	1	0.00	0.00	39	1
40	1	0.00	0.00	40	1
41	1	0.00	0.00	41	1
42	1	0.00	0.00	42	1
43	1	0.00	0.00	43	1
44	1	0.00	0.00	44	1
45	1	0.00	0.00	45	1
46	1	0.00	0.00	46	1
47	1	0.00	0.00	47	1
48	1	0.00	0.00	48	1
49	1	0.00	0.00	49	1
50	1	0.00	0.00	50	4
51	1	0.00	0.00	50	5
\.


--
-- Data for Name: request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request (id, comment, status, "addressId", "brigadierId", "clientId", "stageId", "registerDate", "mountingDate", "deletedAt") FROM stdin;
37	Ссауцауца	InProcessing	37	\N	1	3	2023-04-10 15:54:13.859508+00	2023-04-14	\N
38	Ми	Completed	38	\N	1	3	2023-04-10 16:12:38.575215+00	2023-04-14	\N
39	цйвцувац	Approved	39	3	1	1	2023-04-10 16:17:25.904217+00	2023-04-19	\N
41	у	Approved	41	4	1	2	2023-04-10 16:22:26.303009+00	2023-04-12	\N
40	ацуацуа	Approved	40	5	1	1	2023-04-10 16:19:56.659743+00	2023-04-19	\N
36	ршрш	Completed	36	4	1	3	2023-04-10 13:42:10.120677+00	2023-04-14	\N
1	Частный дом	InProcessing	1	3	1	2	2023-04-10 13:42:10.120677+00	2023-04-14	\N
2	ощшпуо	InProcessing	2	2	2	2	2023-04-10 13:42:10.120677+00	2023-04-14	\N
35	Код от домофона - 1444	Completed	35	5	2	1	2023-04-10 13:42:10.120677+00	2023-04-14	\N
42	\N	Approved	42	3	1	1	2023-04-10 16:22:45.021688+00	2023-04-12	\N
44	Злая осбака	Accepted	44	2	1	3	2023-04-16 15:00:57.835529+00	2023-04-20	\N
43	ч	Accepted	43	2	1	1	2023-04-11 16:24:38.641458+00	2023-04-16	\N
\.


--
-- Data for Name: request_equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_equipment (id, quantity, "equipmentId", "requestId", "deletedAt") FROM stdin;
1	1	2	1	\N
2	2	3	1	\N
3	3	3	2	\N
4	2	4	2	\N
36	1	1	35	\N
37	2	3	35	\N
38	5	2	36	\N
39	2	3	36	\N
40	2	1	37	\N
41	2	2	38	\N
42	1	3	38	\N
43	1	3	39	\N
44	1	1	39	\N
45	1	1	40	\N
46	1	3	41	\N
47	1	2	42	\N
48	1	3	42	\N
49	1	2	43	\N
51	2	1	44	\N
52	1	2	44	\N
53	3	3	44	\N
50	2	\N	43	\N
\.


--
-- Data for Name: request_report; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_report (id, url, "requestId", "brigadierId", "deletedAt", public_id) FROM stdin;
4	https://res.cloudinary.com/dblablirp/image/upload/v1653247002/qcg8wablza0kh3agnt6i.webp	41	\N	\N	\N
6	https://res.cloudinary.com/dblablirp/image/upload/v1653247002/qcg8wablza0kh3agnt6i.webp	41	\N	\N	\N
7	https://res.cloudinary.com/dblablirp/image/upload/v1653247002/qcg8wablza0kh3agnt6i.webp	41	\N	\N	\N
8	[object Object]	1	\N	\N	\N
42	https://res.cloudinary.com/dblablirp/image/upload/v1681655307/reports/2/Screenshot%202023-03-02%20132029.png.png	2	2	\N	reports/2/Screenshot 2023-03-02 132029.png
45	https://res.cloudinary.com/dblablirp/image/upload/v1681664185/reports/42/Screenshot%202023-03-02%20085600.png.png	42	3	\N	reports/42/Screenshot 2023-03-02 085600.png
46	https://res.cloudinary.com/dblablirp/image/upload/v1681664185/reports/42/Screenshot%202023-03-05%20154949.png.png	42	3	\N	reports/42/Screenshot 2023-03-05 154949.png
\.


--
-- Data for Name: schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule (id, "brigadierId", "requestId", "modifiedDate", "deletedAt") FROM stdin;
2	2	2	2023-04-10 13:43:06.76568+00	2023-04-10 13:45:25.551463+00
37	4	2	2023-04-10 13:43:06.76568+00	2023-04-10 13:45:25.551463+00
38	5	2	2023-04-10 13:45:25.567173+00	2023-04-10 13:56:41.290951+00
39	1	2	2023-04-10 13:56:41.306064+00	2023-04-10 13:57:52.95603+00
40	3	2	2023-04-10 13:57:52.968508+00	2023-04-10 13:58:02.13772+00
42	3	39	2023-04-11 17:10:38.264681+00	\N
44	3	42	2023-04-11 17:10:57.337226+00	\N
45	4	41	2023-04-11 17:11:05.840257+00	\N
46	5	40	2023-04-11 17:11:32.729533+00	\N
36	1	36	2023-04-10 13:43:06.76568+00	2023-04-11 17:11:40.758166+00
47	4	36	2023-04-11 17:11:40.794872+00	\N
35	2	35	2023-04-10 13:43:06.76568+00	2023-04-11 17:11:53.412735+00
48	5	35	2023-04-11 17:11:53.428056+00	\N
1	2	1	2023-04-10 13:43:06.76568+00	2023-04-11 17:12:04.198308+00
3	1	1	2023-04-10 13:43:06.76568+00	2023-04-11 17:12:04.198308+00
49	3	1	2023-04-11 17:12:04.210811+00	\N
41	1	2	2023-04-10 13:58:02.148001+00	2023-04-11 17:12:13.63709+00
50	2	2	2023-04-11 17:12:13.647558+00	\N
43	4	43	2023-04-11 17:10:47.394625+00	2023-04-16 14:52:34.77109+00
51	2	43	2023-04-16 14:52:34.802555+00	\N
52	1	44	2023-04-16 15:02:07.75853+00	2023-04-16 15:41:10.335342+00
53	2	44	2023-04-16 15:41:10.348003+00	\N
\.


--
-- Data for Name: stage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stage (id, stage, "mountingPrice") FROM stdin;
2	Черновая	150.00
3	Обе	200.00
1	Чистовая	70.00
\.


--
-- Data for Name: tool; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tool (id, name, "stageId", "deletedAt") FROM stdin;
1	Перфоратор	2	\N
2	Рулетка	3	\N
4	Молоток	3	\N
5	Линейка	3	\N
6	t2r3443t	2	\N
3	Ножницs	1	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, login, email, password, "resetPasswordLink", "activationLink", "temporaryPassword", "isActivated", role, "deletedAt") FROM stdin;
1	admin	lizavetazinovich@gmail.com	$2a$04$zjpv/0CdrBrCi0pjiGQkcufvu707pOX71GfMuZUeLBiZVCeVmblqC	\N	\N	\N	t	Admin	\N
2	client1	client1@gmail.com	$2a$04$4EYhWTCZiu.QcM27.6BgBu1wg6dID8QOxN3TGTLTxPZ7jZ4XS4RHa	\N	9230c9a8-abc1-4df6-bf01-b14965ba36d5	\N	t	Client	\N
4	brigadier2	brigadier2@gmail.com	$2a$04$uKTuYJYkoWhp4zIkvfUu.elGlQtTghasUgBmSBInWkBVBMAhtmqWq	\N	b0fda5aa-81ef-4aed-ace6-21c77687491d	\N	t	Brigadier	\N
7	client3	client3@gmail.com	$2a$04$KcTVhzOY.FQ/Y03UuO9/JelvD6Z1OAsPiN3.8xSYoFzRhRPiZ3bGu	\N	28cfa972-a439-4954-9976-1dc2cf2d5b80	\N	t	Client	\N
5	brigadier3	brigadier3@gmail.com	$2a$04$CYK7AwYeQ4Qw8kg7w0XB1O6zewP9CUIg/14IHOQUkucWetjk0KRim	\N	b3dde61f-c77a-4dec-b29d-12d0dca4a810	\N	t	Brigadier	\N
8	brigadier4	brigadier4@gmail.com	$2a$04$UVHjMcJryTwAkrlq3yoSDODruNdM4X2GYo/GRIcxxMYSWWWnNeSZq	\N	cc9928a0-2fa9-490f-bb6b-bdb782f77544	\N	t	Brigadier	\N
9	brigadier6	brigadier6@gmail.com	$2a$04$KEwBy7quVqKb.IMSnw7ozOiBlUWyINOR17zzytInlgQYRSCQrnoqm	\N	542dc62b-c7ad-4d4f-abe4-b1f33a64f390	\N	t	Brigadier	\N
10	string	string@mail.ru	$2a$04$V2WEH6jUQRAFe79..uf1auTFMLWe9O1y5xRPrtNUHaEpiTl4yZpZS	\N	f998dbef-397b-4716-82b5-ffba7b457be0	\N	t	Client	\N
3	brigadier1	brigadier1@gmail.com	$2a$04$MsfT7yy8ZK51yRe94BcQ0uuhSQgwr1f617fqY/PguWy7jR1oaJaMK	\N	f8fded90-65dd-46d2-90e8-a48538ca8504	\N	f	Brigadier	\N
6	client2	client2@gmail.com	$2a$04$yCPypCsf0WnPGWMfvzuSa.ZLSaDVF1D8vFKO4OR6S0FYprKWvx0du	\N	b098fef5-c574-4215-837c-429653428d6b	\N	t	Client	\N
\.


--
-- Name: accessory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accessory_id_seq', 15, true);


--
-- Name: address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_id_seq', 44, true);


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
-- Name: invoice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_id_seq', 50, true);


--
-- Name: invoice_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_item_id_seq', 51, true);


--
-- Name: request_equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_equipment_id_seq', 53, true);


--
-- Name: request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_id_seq', 44, true);


--
-- Name: request_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_report_id_seq', 46, true);


--
-- Name: schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_id_seq', 53, true);


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
-- Name: invoice PK_15d25c200d9bcd8a33f698daf18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY (id);


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
-- Name: invoice_item PK_621317346abdf61295516f3cb76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_item
    ADD CONSTRAINT "PK_621317346abdf61295516f3cb76" PRIMARY KEY (id);


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
-- Name: user UQ_a62473490b3e4578fd683235c5e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE (login);


--
-- Name: brigadier UQ_c4e9124b1ee7a27d9fd2c3d8d70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brigadier
    ADD CONSTRAINT "UQ_c4e9124b1ee7a27d9fd2c3d8d70" UNIQUE ("userId");


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
-- Name: invoice_item_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX invoice_item_pkey ON public.invoice_item USING btree (id);


--
-- Name: invoice_pkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX invoice_pkey ON public.invoice USING btree (id);


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
-- Name: invoice_item FK_553d5aac210d22fdca5c8d48ead; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_item
    ADD CONSTRAINT "FK_553d5aac210d22fdca5c8d48ead" FOREIGN KEY ("invoiceId") REFERENCES public.invoice(id);


--
-- Name: invoice_item FK_665e1dd6d822f2cfcff5143cd02; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_item
    ADD CONSTRAINT "FK_665e1dd6d822f2cfcff5143cd02" FOREIGN KEY ("accessoryId") REFERENCES public.accessory(id);


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
-- Name: invoice FK_925aa26ea12c28a6adb614445ee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "FK_925aa26ea12c28a6adb614445ee" FOREIGN KEY ("customerId") REFERENCES public.brigadier(id);


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

