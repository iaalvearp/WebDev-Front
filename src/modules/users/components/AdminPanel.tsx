import { useState, useEffect, useCallback, memo, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Search, Save, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { adminSchema, type AdminTableConfig, type AdminField } from '../config/adminSchema';
import { useBooking } from '@/modules/booking/context/BookingContext';

// --- COMPONENTES AUXILIARES ---

const DynamicSelect = memo(({ field, setValue, value, isDark, sourceEndpoint, dependentValue, editData }: { field: AdminField, setValue: any, value?: any, isDark: boolean, sourceEndpoint?: string, dependentValue?: any, editData?: any }) => {
    const [options, setOptions] = useState<any[]>([]);
    const firstRender = useRef(true);

    // Effect to clear the child select's value when its parent's value changes
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        // Solo resetear si NO estamos en modo edición (o si el usuario cambió manualmente el padre)
        // Pero como no sabemos si fue manual o carga inicial...
        // La protección firstRender ayuda, pero si el usuario cambia Cine A a Cine B, Sala debe limpiarse.
        // Si estamos editando y dependentValue cambia (porque el usuario cambió Cine), debe limpiarse igual.
        if (field.dependentField) {
            setValue(field.name, "");
        }
    }, [dependentValue, field.dependentField, field.name, setValue]);

    useEffect(() => {
        let mounted = true;
        const fetchOptions = async () => {
            // If this field is dependent and the parent value is not set, clear options and return.
            // Unless we are in editData mode (Modify), where we might want to fetch all or default options if parent is missing
            // But usually parent is required. 
            if (field.dependentField && !dependentValue && !editData) {
                setOptions([]);
                return;
            }

            // Use the provided sourceEndpoint (which might already include dependent params)
            // If no sourceEndpoint is provided, and it's not a dependent field, use field.sourceEndpoint
            const endpointToFetch = sourceEndpoint || field.sourceEndpoint;

            if (!endpointToFetch) {
                // Fallback for edit mode with missing parent: try base endpoint?
                // If we have editData but no endpoint (because dependentValue empty), try fetching base list
                if (editData && field.sourceEndpoint) {
                    // This allows showing ALL salas if cinema is unknown, so user can pick one.
                } else {
                    setOptions([]);
                    return;
                }
            }

            // Final fallback logic for endpoint
            const urlToUse = endpointToFetch || field.sourceEndpoint!;

            try {
                const url = urlToUse.startsWith('http') ? urlToUse : `http://localhost:8080${urlToUse}`;

                const res = await fetch(url);
                if (res.ok && mounted) {
                    const data = await res.json();
                    let finalOptions = Array.isArray(data) ? data : [];

                    // Client-side filtering fallback
                    if (dependentValue && field.dependentParam) {
                        finalOptions = finalOptions.filter(opt => {
                            const val = dependentValue;
                            // Case 1: Direct match (cityId == 1)
                            if (opt[field.dependentParam!] == val) return true;

                            // Case 2: Nested 'cinema.id' / 'city.id'
                            const relationKey = field.dependentParam!.replace('Id', '');
                            if (opt[relationKey] && opt[relationKey].id == val) return true;

                            // Case 3: Spanish 'cine.id'
                            if (relationKey === 'cinema' && opt.cine && opt.cine.id == val) return true;

                            // Case 4: Legacy/Alternative 'idCine'
                            if (opt[`id${relationKey.charAt(0).toUpperCase() + relationKey.slice(1)}`] == val) return true;

                            return false;
                        });
                    }
                    setOptions(finalOptions);
                }
            } catch (error) {
                // console.error(`Error loading options for ${field.name}`, error);
            }
        };
        fetchOptions();
        return () => { mounted = false; };
    }, [sourceEndpoint, field.sourceEndpoint, field.dependentField, field.dependentParam, dependentValue, field.name, editData]);

    return (
        <div className="relative">
            <select
                value={value ? String(value) : ""}
                onChange={(e) => setValue(field.name, e.target.value)}
                disabled={Boolean(field.dependentField && !dependentValue && !editData)}
                className={`w-full p-2 h-10 rounded-md border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F5B041] focus:border-transparent ${isDark
                    ? 'bg-neutral-900 border-white/10 text-white disabled:opacity-50'
                    : 'bg-neutral-100 border-neutral-300 text-black disabled:opacity-50'
                    }`}
            >
                <option value="" disabled>Seleccionar {field.label}</option>
                {options.map((opt) => (
                    <option
                        key={String(opt[field.sourceValue || 'id'])}
                        value={String(opt[field.sourceValue || 'id'])}
                    >
                        {/* Muestra el nombre del cine si es una sala */}
                        {opt.cinema ? `${opt.name} - ${opt.cinema.name}` : (opt[field.sourceLabel || 'name'] || opt['nombre'] || 'Opción')}
                    </option>
                ))}
            </select>
            {/* Custom Arrow Icon for consistent styling */}
            <div className={`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none ${isDark ? 'text-white/50' : 'text-black/50'} ${field.dependentField && !dependentValue ? 'hidden' : ''}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
});
DynamicSelect.displayName = 'DynamicSelect';

const DynamicMultiSelect = memo(({ field, setValue, defaultValue, isDark }: { field: AdminField, setValue: any, defaultValue?: any, isDark: boolean }) => {
    const [options, setOptions] = useState<any[]>([]);
    // Inicialización segura: si viene string lo convierte a array, si es array lo deja, si no []
    const [selected, setSelected] = useState<string[]>(
        Array.isArray(defaultValue) ? defaultValue : (typeof defaultValue === 'string' && defaultValue ? defaultValue.split(', ') : [])
    );

    useEffect(() => {
        let mounted = true;
        const fetchOptions = async () => {
            if (!field.sourceEndpoint) return;
            try {
                const res = await fetch(`http://localhost:8080${field.sourceEndpoint}`);
                if (res.ok && mounted) {
                    const data = await res.json();
                    setOptions(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchOptions();
        return () => { mounted = false; };
    }, [field.sourceEndpoint]);

    // Actualizar formulario cada vez que cambia la selección
    useEffect(() => {
        setValue(field.name, selected, { shouldValidate: true, shouldDirty: true });
    }, [selected, field.name, setValue]);

    const toggleSelection = (value: string) => {
        setSelected(prev => {
            if (prev.includes(value)) {
                return prev.filter(v => v !== value);
            } else {
                if (prev.length >= 3) {
                    toast.error("Máximo 3 opciones permitidas");
                    return prev;
                }
                return [...prev, value];
            }
        });
    };

    return (
        <div className="space-y-2">
            <div className={`flex flex-wrap gap-2 p-3 border rounded-md min-h-[3rem] transition-colors ${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-300'}`}>
                {options.map((opt) => {
                    const val = String(opt[field.sourceValue || 'name']); // Usamos 'name' por defecto
                    const isSelected = selected.includes(val);
                    return (
                        <button
                            type="button"
                            key={val}
                            onClick={() => toggleSelection(val)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${isSelected
                                ? 'bg-[#F5B041] text-black border-[#F5B041]'
                                : (isDark ? 'bg-white/10 text-white border-transparent hover:bg-white/20' : 'bg-neutral-200 text-black hover:bg-neutral-300')
                                }`}
                        >
                            {opt[field.sourceLabel || 'name']}
                        </button>
                    );
                })}
            </div>
            <p className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-neutral-500'}`}>Selecciona entre 1 y 3 opciones.</p>
        </div>
    );
});
DynamicMultiSelect.displayName = 'DynamicMultiSelect';

// --- FORMULARIO DINÁMICO ---
const DynamicForm = memo(({
    config,
    editData,
    onSubmit,
    onDelete,
    isLoading,
    isDark
}: {
    config: AdminTableConfig,
    editData?: any,
    onSubmit: (data: any) => void,
    onDelete?: () => void,
    isLoading: boolean,
    isDark: boolean
}) => {
    const { register, handleSubmit, setValue, watch, reset } = useForm();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (editData) {
            reset(editData);
        } else {
            const defaultValues: any = {};
            config.fields.forEach(f => {
                if (f.type === 'boolean') defaultValues[f.name] = false;
            });
            reset(defaultValues);
        }
    }, [editData, reset, config]);

    const handleFormSubmit = (data: any) => {
        const formattedData = { ...data };

        // ---------------------------------------------------------
        // PARCHE CRÍTICO PARA JAVA: STRING -> ARRAY
        // ---------------------------------------------------------

        // 1. CAST (Actores): Viene del Textarea como "Actor 1, Actor 2"
        // Java espera: ["Actor 1", "Actor 2"]
        if (typeof formattedData.cast === 'string') {
            formattedData.cast = formattedData.cast
                .split(',')
                .map((s: string) => s.trim())
                .filter((s: string) => s !== "");
        }

        // 2. GENRE & FORMATS: Vienen del MultiSelect
        // Aseguramos que sean Arrays. Si por alguna razón llegan como String, los partimos.
        ['genre', 'formats'].forEach(key => {
            const val = formattedData[key];
            if (typeof val === 'string') {
                formattedData[key] = val.split(',').map((s: string) => s.trim()).filter(Boolean);
            } else if (!val) {
                formattedData[key] = []; // Array vacío en vez de null/undefined
            }
            // Si ya es array, lo dejamos tal cual (Java ya lo acepta así)
        });

        // 4. TRANSFORM RELATIONS (Flat ID -> Nested Object)
        // Check for specific ID fields and create both English and Spanish nested objects
        // to ensure backend compatibility.

        const transformRelations = (data: any) => {
            const transformed = { ...data };

            // --- DUAL SAVE for SPANISH BACKEND SUPPORT (Simple Fields) ---
            // Backend might expect 'nombre', 'direccion', etc.
            if (transformed.address) transformed.direccion = transformed.address;
            if (transformed.name) transformed.nombre = transformed.name;
            if (transformed.description) transformed.descripcion = transformed.description;
            if (transformed.title) transformed.titulo = transformed.title;

            // Mapping definitions: [fieldName, englishObj, spanishObj]
            const relations = [
                ['cityId', 'city', 'ciudad'],
                ['cinemaId', 'cinema', 'cine'],
                ['movieId', 'movie', 'pelicula'],
                ['salaId', 'sala', 'sala']
            ];

            relations.forEach(([idField, engKey, espKey]) => {
                if (transformed[idField]) {
                    const idVal = Number(transformed[idField]);
                    const idObj = { id: idVal };

                    transformed[engKey] = idObj;
                    if (espKey !== engKey) {
                        transformed[espKey] = idObj;
                    }

                    // delete transformed[idField]; // KEEP ID JUST IN CASE BACKEND EXPECTS FLAT ID
                }
            });
            return transformed;
        };

        const payload = transformRelations(formattedData);

        // 5. REMOVE VIRTUAL FIELDS (Helpers like City/Cinema filters)
        config.fields.forEach(field => {
            if (field.virtual) {
                delete payload[field.name];
            }
        });

        console.log("PAYLOAD ENVIADO A JAVA:", JSON.stringify(payload, null, 2));
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.fields.map((field) => {
                    // Si estamos editando y el campo es virtual (solo filtro), lo ocultamos
                    if (editData && field.virtual) return null;

                    // Lógica de Cascada (Cascading Selects)
                    // Si no hay valor en el formulario (watch), buscamos en editData por si es un campo oculto/virtual
                    let dependentValue = field.dependentField ? watch(field.dependentField) : undefined;
                    if (field.dependentField && !dependentValue && editData) {
                        dependentValue = editData[field.dependentField];
                    }

                    let dynamicEndpoint = field.sourceEndpoint;

                    if (field.dependentField) {
                        if (dependentValue) {
                            // Si hay valor del padre, filtramos
                            const separator = field.sourceEndpoint?.includes('?') ? '&' : '?';
                            dynamicEndpoint = `${field.sourceEndpoint}${separator}${field.dependentParam}=${dependentValue}`;
                        } else {
                            // Si depende de algo y no está seleccionado, no cargamos nada
                            // Excepto si estamos EDITANDO, donde queremos que cargue las opciones válidas para el valor actual
                            if (!editData) {
                                dynamicEndpoint = undefined;
                            }
                        }
                    }

                    // Resetear hijo si cambia padre (Opcional pero recomendable)
                    // Esto se complica en react-hook-form dentro del map sin un useEffect específico.
                    // React-hook-form mantiene el estado. Si cambias de Cine A a Cine B, Sala ID 5 (de Cine A) sigue seleccionada.
                    // Para MVP, el usuario cambiará manualmente.

                    return (
                        <div key={field.name} className={
                            ['textarea', 'multi-select'].includes(field.type) ? 'col-span-2' : 'col-span-1'
                        }>
                            <Label className={`${isDark ? 'text-white' : 'text-black'} mb-1.5 block text-xs uppercase tracking-wider`}>{field.label}</Label>

                            {field.type === 'textarea' ? (
                                <Textarea
                                    {...register(field.name)}
                                    placeholder={field.name === 'cast' ? "Ej: Actor 1, Actor 2 (Separados por comas)" : ""}
                                    className={`min-h-[100px] transition-colors border ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F5B041]' : 'bg-neutral-100 border-neutral-300 text-black placeholder:text-neutral-500 focus:border-[#F5B041]'}`}
                                />
                            ) : field.type === 'select' ? (
                                <DynamicSelect
                                    field={field}
                                    setValue={setValue}
                                    value={watch(field.name)}
                                    isDark={isDark}
                                    sourceEndpoint={dynamicEndpoint}
                                    dependentValue={dependentValue}
                                    editData={editData}
                                />
                            ) : field.type === 'multi-select' ? (
                                <DynamicMultiSelect
                                    field={field}
                                    setValue={setValue}
                                    defaultValue={editData ? editData[field.name] : []}
                                    isDark={isDark}
                                />
                            ) : field.type === 'boolean' ? (
                                <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-300'}`}>
                                    <Switch
                                        className="data-[state=unchecked]:bg-black/20 data-[state=checked]:bg-[#F5B041]"
                                        checked={watch(field.name)}
                                        onCheckedChange={(c) => setValue(field.name, c)}
                                    />
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>{watch(field.name) ? 'ACTIVADO' : 'DESACTIVADO'}</span>
                                </div>
                            ) : (
                                <Input
                                    type={field.type === 'date' ? 'date' : field.type === 'time' ? 'time' : 'text'}
                                    {...register(field.name)}
                                    className={`transition-colors border scheme-dark ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F5B041]' : 'bg-neutral-100 border-neutral-300 text-black placeholder:text-neutral-500 focus:border-[#F5B041]'}`}
                                    step={field.type === 'time' ? '60' : undefined}
                                />
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="flex gap-4">
                <Button disabled={isLoading} type="submit" className="flex-1 bg-[#F5B041] hover:bg-[#F5B041]/90 text-black font-bold h-12 mt-4 rounded-xl shadow-lg shadow-orange-500/10">
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    GUARDAR REGISTRO
                </Button>

                {onDelete && (
                    !showDeleteConfirm ? (
                        <Button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-12 mt-4 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50"
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    ) : (
                        <div className="flex gap-2 mt-4 animate-in fade-in slide-in-from-right-4">
                            <Button
                                type="button"
                                disabled={isLoading}
                                onClick={onDelete}
                                className="h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                            >
                                ¿CONFIRMAR?
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="h-12 w-12 rounded-xl"
                            >
                                ✕
                            </Button>
                        </div>
                    )
                )}
            </div>
        </form>
    );
});
DynamicForm.displayName = 'DynamicForm';

// --- COMPONENTE PRINCIPAL ---

export function AdminPanel() {
    const [selectedTable, setSelectedTable] = useState<AdminTableConfig | null>(null);
    const [activeTab, setActiveTab] = useState('create');
    const [searchId, setSearchId] = useState('');
    const [editData, setEditData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Obtenemos el cine del contexto para filtrar las salas al crear funciones
    const { cinema } = useBooking();

    // Detectar tema
    useEffect(() => {
        const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
        checkTheme(); // Chequeo inicial
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleClose = (open: boolean) => {
        if (!open) {
            setSelectedTable(null);
            setEditData(null);
            setSearchId('');
            setActiveTab('create');
        }
    };

    const handleCreate = async (data: any) => {
        if (!selectedTable) return;
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:8080${selectedTable.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                toast.success('Registro creado exitosamente');
                setEditData(null);
                setSelectedTable(null); // Cerrar modal al guardar
            } else {
                const errorText = await res.text();
                console.error("Error backend:", errorText);
                toast.error('Error al guardar. Revisa los datos.');
            }
        } catch (e) {
            toast.error('Error de conexión');
        } finally {
            setIsLoading(false);
        }
    };

    // Modificar handleSearch para aplanar datos
    const handleSearch = async () => {
        if (!selectedTable || !searchId) return;
        setIsLoading(true);

        const flattenData = (data: any) => {
            if (!data) return null;
            const flat = { ...data };

            // Helper para obtener ID de forma segura
            const getId = (obj: any) => obj.id || obj._id || obj.cod || obj.codigo;

            // Mapeo específico para Funciones (nested objects -> IDs)
            if (data.movie && typeof data.movie === 'object') flat.movieId = getId(data.movie);
            if (data.pelicula && typeof data.pelicula === 'object') flat.movieId = getId(data.pelicula);

            if (data.sala && typeof data.sala === 'object') flat.salaId = getId(data.sala);

            if (data.cinema && typeof data.cinema === 'object') flat.cinemaId = getId(data.cinema);
            if (data.cine && typeof data.cine === 'object') flat.cinemaId = getId(data.cine);

            if (data.city && typeof data.city === 'object') flat.cityId = getId(data.city);
            if (data.ciudad && typeof data.ciudad === 'object') flat.cityId = getId(data.ciudad);

            // --- FALLBACK: FLAT IDs (Si no vienen como objetos) ---
            if (!flat.cinemaId) flat.cinemaId = data.cinemaId || data.idCine || data.cineId || data.fk_cine;
            if (!flat.cityId) flat.cityId = data.cityId || data.idCiudad || data.ciudadId || data.fk_ciudad;
            if (!flat.salaId) flat.salaId = data.salaId || data.idSala;
            if (!flat.movieId) flat.movieId = data.movieId || data.idPelicula || data.idPelicula;

            // --- SPANISH FIELD MAPPING (READ) ---
            flat.address = data.address || data.direccion;
            flat.name = data.name || data.nombre || data.title || data.titulo;
            flat.description = data.description || data.descripcion;

            // Ensure we have a cinemaId for the logic below, even if not explicitly mapped above
            // (Sometimes it might be deeply nested in sala, but usually flat.cinemaId is set by now if flattened correctly)
            if (!flat.cinemaId && data.sala && (data.sala.cinema || data.sala.cine)) {
                flat.cinemaId = getId(data.sala.cinema || data.sala.cine);
            }

            // Arrays a String (para textareas o displays simples si falla el multi)
            if (Array.isArray(flat.cast)) flat.cast = flat.cast.join(', ');

            console.log("Flattened Data:", flat);
            return flat;
        };

        try {
            // Intento 1: Búsqueda directa por ID (Solo si es número)
            let directData = null;
            if (!isNaN(Number(searchId))) {
                const res = await fetch(`http://localhost:8080${selectedTable.endpoint}/${searchId}`);
                if (res.ok) {
                    directData = await res.json();
                }
            }

            let flatResult = null;
            if (directData) {
                flatResult = flattenData(directData);
                // --- INVERSE SEARCH RECOVERY FOR SALAS (Direct Search) ---
                // Si la API de Salas no devuelve el cine, buscamos en la lista de Cines quién tiene esta sala.
                if (selectedTable.label === 'SALAS' && flatResult && !flatResult.cinemaId) {
                    try {
                        const resCines = await fetch('http://localhost:8080/api/cinemas');
                        if (resCines.ok) {
                            const cines = await resCines.json();
                            // Buscamos el cine que tenga esta sala en su lista
                            const foundCinema = cines.find((c: any) =>
                                (Array.isArray(c.salas) && c.salas.some((s: any) => String(s.id) === String(flatResult.id))) ||
                                (Array.isArray(c.rooms) && c.rooms.some((s: any) => String(s.id) === String(flatResult.id)))
                            );
                            if (foundCinema) {
                                flatResult.cinemaId = foundCinema.id;
                                console.log("Cine recuperado por búsqueda inversa:", foundCinema.name);
                            }
                        }
                    } catch (e) { console.error("Error recuperando cine:", e); }
                }
            }


            if (flatResult) {
                // ÉXITO DIRECTO
                setEditData(flatResult);
                toast.success('Registro cargado');
            } else {
                // Intento 2: Búsqueda Local (Fallback inteligente)
                const resAll = await fetch(`http://localhost:8080${selectedTable.endpoint}`);
                if (resAll.ok) {
                    const allData = await resAll.json();
                    if (Array.isArray(allData)) {
                        const term = searchId.toLowerCase();
                        const found = allData.find((item: any) => {
                            const idMatch = item.id == searchId;
                            // Mejora en la búsqueda de texto (busca dentro de objetos anidados)
                            const nameStr = item.name || item.title || item.nombre || '';
                            const movieStr = item.movie?.title || item.pelicula?.title || item.pelicula?.nombre || '';
                            const salaStr = item.sala?.name || item.sala?.nombre || '';

                            const nameMatch = nameStr.toString().toLowerCase().includes(term);
                            const movieMatch = movieStr.toString().toLowerCase().includes(term);
                            const salaMatch = salaStr.toString().toLowerCase().includes(term);

                            return idMatch || nameMatch || movieMatch || salaMatch;
                        });

                        if (found) {
                            flatResult = flattenData(found);
                            // --- INVERSE SEARCH RECOVERY FOR SALAS (Local Search) ---
                            if (selectedTable.label === 'SALAS' && flatResult && !flatResult.cinemaId) {
                                try {
                                    const resCines = await fetch('http://localhost:8080/api/cinemas');
                                    if (resCines.ok) {
                                        const cines = await resCines.json();
                                        const foundCinema = cines.find((c: any) =>
                                            (Array.isArray(c.salas) && c.salas.some((s: any) => String(s.id) === String(flatResult.id))) ||
                                            (Array.isArray(c.rooms) && c.rooms.some((s: any) => String(s.id) === String(flatResult.id)))
                                        );
                                        if (foundCinema) {
                                            flatResult.cinemaId = foundCinema.id;
                                            console.log("Cine recuperado por búsqueda inversa:", foundCinema.name);
                                        }
                                    }
                                } catch (e) { console.error("Error recuperando cine:", e); }
                            }
                            setEditData(flatResult);
                            const foundName = found.name || found.title || found.nombre ||
                                (found.movie ? found.movie.title : '') ||
                                (found.pelicula ? found.pelicula.title || found.pelicula.nombre : '') ||
                                'Registro';
                            toast.success(`Encontrado: ${foundName} (ID: ${found.id})`);
                            return;
                        }
                    }
                }
                toast.error(`No se encontró "${searchId}"`);
                setEditData(null);
            }
        } catch (e) {
            toast.error('Error al búscar');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedTable || !searchId) return;
        setIsLoading(true);
        try {
            let payload = { ...data, id: Number(searchId) };

            // Remove virtual fields from update payload too
            selectedTable.fields.forEach(field => {
                if (field.virtual) {
                    delete payload[field.name];
                }
            });

            // --- TRANSFORM RELATIONS FOR UPDATE (Fix for losing connections on edit) ---
            // Also apply SIMPLE FIELDS transformation for update
            if (payload.address) payload.direccion = payload.address;
            if (payload.name) payload.nombre = payload.name;
            if (payload.description) payload.descripcion = payload.description;
            if (payload.title) payload.titulo = payload.title;

            const relations = [
                ['cityId', 'city', 'ciudad'],
                ['cinemaId', 'cinema', 'cine'],
                ['movieId', 'movie', 'pelicula'],
                ['salaId', 'sala', 'sala']
            ];

            relations.forEach(([idField, engKey, espKey]) => {
                if (payload[idField]) {
                    const idVal = Number(payload[idField]);
                    const idObj = { id: idVal };

                    payload[engKey] = idObj;
                    if (espKey !== engKey) {
                        payload[espKey] = idObj;
                    }

                    // delete payload[idField];
                }
            });

            console.log("PAYLOAD UPDATE ENVIADO:", JSON.stringify(payload, null, 2));

            const res = await fetch(`http://localhost:8080${selectedTable.endpoint}/${searchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                toast.success('Actualizado correctamente');
                setSelectedTable(null); // Cerrar modal al actualizar
            } else {
                toast.error('Error al actualizar');
            }
        } catch (e) {
            toast.error('Error de conexión');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedTable || !searchId) return;
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:8080${selectedTable.endpoint}/${searchId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success('Registro eliminado permanentemente');
                setSelectedTable(null); // Cerrar modal
            } else {
                toast.error('Error al eliminar');
            }
        } catch (e) {
            toast.error('Error de conexión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {adminSchema.map((table) => {
                // Removed complex memoization as DynamicForm now handles cascading internally via watchers
                const configToPass = table;

                return (
                    <Dialog key={table.label} open={selectedTable?.label === table.label} onOpenChange={(open) => !open && handleClose(false)}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => setSelectedTable(configToPass)}
                                variant="outline"
                                className={`h-24 flex flex-col items-center justify-center gap-2 border transition-all group ${isDark ? 'border-white/10 bg-white/5 hover:border-[#F5B041] hover:bg-[#F5B041]/10' : 'border-gray-200 bg-white hover:border-[#F5B041] hover:bg-orange-50 shadow-sm'}`}
                            >
                                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-[#F5B041]`}>{table.label}</span>
                                <span className="text-xs text-muted-foreground">Administrar</span>
                            </Button>
                        </DialogTrigger>

                        <DialogContent className={`max-w-3xl backdrop-blur-xl border sm:rounded-2xl max-h-[85vh] overflow-y-auto transition-colors duration-300 ${isDark ? 'bg-neutral-900/95 border-white/10 text-white' : 'bg-white/95 border-black/10 text-neutral-900 shadow-2xl'}`}>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-[#F5B041]">
                                    {table.label}
                                </DialogTitle>
                                <DialogDescription className={isDark ? 'text-gray-400' : 'text-neutral-500'}>
                                    Gestiona los registros de la tabla {table.label.toLowerCase()}.
                                </DialogDescription>
                            </DialogHeader>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                                <TabsList className={`grid w-full grid-cols-2 p-1 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'}`}>
                                    <TabsTrigger
                                        value="create"
                                        className="data-[state=active]:bg-[#F5B041] data-[state=active]:text-black data-[state=active]:font-bold transition-all rounded-lg"
                                    >
                                        CREAR
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="modify"
                                        className="data-[state=active]:bg-[#F5B041] data-[state=active]:text-black data-[state=active]:font-bold transition-all rounded-lg"
                                    >
                                        MODIFICAR
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="create" className="mt-4">
                                    <DynamicForm
                                        config={configToPass}
                                        editData={null}
                                        onSubmit={handleCreate}
                                        isLoading={isLoading}
                                        isDark={isDark}
                                    />
                                </TabsContent>

                                <TabsContent value="modify" className="mt-4">
                                    <div className="flex gap-2 mb-6">
                                        <Input
                                            placeholder="Ingresa el ID..."
                                            value={searchId}
                                            onChange={(e) => setSearchId(e.target.value)}
                                            className={`transition-colors border ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F5B041]' : 'bg-neutral-100 border-neutral-300 text-black placeholder:text-neutral-500 focus:border-[#F5B041]'}`}
                                        />
                                        <Button onClick={handleSearch} disabled={isLoading} className={isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-neutral-200 hover:bg-neutral-300 text-black'}>
                                            <Search className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {editData && (
                                        <DynamicForm
                                            config={configToPass}
                                            editData={editData}
                                            onSubmit={handleUpdate}
                                            onDelete={handleDelete}
                                            isLoading={isLoading}
                                            isDark={isDark}
                                        />
                                    )}
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                )
            })}
        </div>
    );
}