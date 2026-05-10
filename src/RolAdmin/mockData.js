const ESCUELAS_KEY = "admin_escuelas";
const DOCENTES_KEY = "admin_docentes";

const escuelasIniciales = [
  {
    id: 1,
    logo: "",
    nombre: "ESCOM",
    ubicacion: "Ciudad de México",
    director: "Dr. Juan García",
    contacto: "55-1234-5678",
    contacto2: "55-8765-4321",
  },
  {
    id: 2,
    logo: "",
    nombre: "ENCB",
    ubicacion: "Ciudad de México",
    director: "Dra. María López",
    contacto: "55-2345-6789",
    contacto2: "",
  },
  {
    id: 3,
    logo: "",
    nombre: "UPIICSA",
    ubicacion: "Ciudad de México",
    director: "Dr. Carlos Ruiz",
    contacto: "55-3456-7890",
    contacto2: "",
  },
];

const docentesIniciales = [
  {
    id: 1,
    nombre: "Ana Martínez",
    escuela: "ESCOM",
    correo: "amartinez@ipn.mx",
    password: "Docente123$",
    foto: "",
    habilitado: true,
    fechaIngreso: "2024-01-15",
    grupos: [1],
  },
  {
    id: 2,
    nombre: "Luis Hernández",
    escuela: "ENCB",
    correo: "lhernandez@ipn.mx",
    password: "Docente123$",
    foto: "",
    habilitado: true,
    fechaIngreso: "2024-02-20",
    grupos: [2],
  },
  {
    id: 3,
    nombre: "Sofía Ramírez",
    escuela: "UPIICSA",
    correo: "sramirez@ipn.mx",
    password: "Docente123$",
    foto: "",
    habilitado: true,
    fechaIngreso: "2024-03-10",
    grupos: [1, 3],
  },
];

// Static grupos + alumnos mock — swapped for real API when backend is ready
export const GRUPOS_MOCK = [
  { id: 1, nombre: "3CV1", turno: "Matutino", materia: "Matemáticas" },
  { id: 2, nombre: "4CM2", turno: "Vespertino", materia: "Física" },
  { id: 3, nombre: "5AV1", turno: "Mixto", materia: "Programación" },
];

export const ALUMNOS_MOCK = {
  1: [
    { id: 1, nombre: "Carlos Ruiz", idUnico: "CR3CV1-01" },
    { id: 2, nombre: "Fernanda Díaz", idUnico: "FD3CV1-02" },
  ],
  2: [
    { id: 3, nombre: "Diego Torres", idUnico: "DT4CM2-01" },
    { id: 4, nombre: "Sofía Pérez", idUnico: "SP4CM2-02" },
  ],
  3: [{ id: 5, nombre: "Marcos Jiménez", idUnico: "MJ5AV1-01" }],
};

export function getGrupoById(id) {
  return GRUPOS_MOCK.find((g) => g.id === id) || null;
}

export function getAlumnosByGrupo(grupoId) {
  return ALUMNOS_MOCK[grupoId] || [];
}

function initData(key, initial) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initial));
  }
}

const DEFAULTS_DOCENTE = {
  habilitado: true,
  fechaIngreso: "2024-01-01",
  grupos: [],
  foto: "",
  password: "",
};

export function getEscuelas() {
  initData(ESCUELAS_KEY, escuelasIniciales);
  try {
    return JSON.parse(localStorage.getItem(ESCUELAS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveEscuelas(data) {
  localStorage.setItem(ESCUELAS_KEY, JSON.stringify(data));
}

export function getDocentes() {
  initData(DOCENTES_KEY, docentesIniciales);
  try {
    const raw = JSON.parse(localStorage.getItem(DOCENTES_KEY) || "[]");
    return raw.map((d) => ({ ...DEFAULTS_DOCENTE, ...d }));
  } catch {
    return [];
  }
}

export function saveDocentes(data) {
  localStorage.setItem(DOCENTES_KEY, JSON.stringify(data));
}

export function nextId(items) {
  return items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}
