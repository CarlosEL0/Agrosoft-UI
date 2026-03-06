import { useState, useMemo } from 'react';

// ── Datos mock ────────────────────────────────────────────────────────────────
const reportesMock = [
    { id: '1', cultivo: 'Maiz rojo', tipo: 'Riego', etapa: 'Germinacion', fecha: '25/06/24' },
    { id: '2', cultivo: 'Frijol bayo', tipo: 'Podacion', etapa: 'Cosecha', fecha: '25/06/24' },
    { id: '3', cultivo: 'Lechuga', tipo: 'Riego', etapa: 'Germinacion', fecha: '25/06/24' },
    { id: '4', cultivo: 'Maiz rojo', tipo: 'Riego', etapa: 'Germinacion', fecha: '24/06/24' },
    { id: '5', cultivo: 'Tomate', tipo: 'Crecimiento', etapa: 'Germinacion', fecha: '23/06/24' },
];

export const filtros = ['Todos', 'Riego', 'Poda', 'fertiliza'];

export function useHistorialGeneral() {
    const [filtroActivo, setFiltroActivo] = useState('Todos');
    const [cargando, setCargando] = useState(false);
    const [reportes, setReportes] = useState(reportesMock); // Aquí vendrán de la API después

    // Cuando la API esté lista:
    // const fetchReportes = async () => { ... }
    // useFocusEffect(...)

    const reportesFiltrados = useMemo(() => {
        return reportes.filter((r) => {
            if (filtroActivo === 'Todos') return true;
            return r.tipo.toLowerCase().includes(filtroActivo.toLowerCase());
        });
    }, [reportes, filtroActivo]);

    return {
        filtros,
        filtroActivo,
        setFiltroActivo,
        reportesFiltrados,
        cargando,
    };
}
