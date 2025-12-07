import { useState, useEffect, useCallback, memo, useRef } from 'react';
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

// --- COMPONENTES AUXILIARES ---

const DynamicSelect = memo(({ field, setValue, defaultValue, isDark }: { field: AdminField, setValue: any, defaultValue?: any, isDark: boolean }) => {
    const [options, setOptions] = useState<any[]>([]);

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
                console.error(`Error loading options for ${field.name}`, error);
            }
        };
        fetchOptions();
        return () => { mounted = false; };
    }, [field.sourceEndpoint]);

    return (
        <Select onValueChange={(val) => setValue(field.name, val)} defaultValue={defaultValue ? String(defaultValue) : undefined}>
            <SelectTrigger className={`w-full border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-neutral-100 border-neutral-300 text-black'}`}>
                <SelectValue placeholder={`Seleccionar ${field.label}`} />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-neutral-900 border-white/10 text-white' : 'bg-white border-neutral-200 text-black'}>
                {options.map((opt) => (
                    <SelectItem
                        key={String(opt[field.sourceValue || 'id'])}
                        value={String(opt[field.sourceValue || 'id'])}
                        className={isDark ? 'focus:bg-white/10 focus:text-white' : 'focus:bg-neutral-100 focus:text-black'}
                    >
                        {/* Muestra el nombre del cine si es una sala */}
                        {opt.cinema ? `${opt.name} - ${opt.cinema.name}` : (opt[field.sourceLabel || 'name'] || opt['nombre'] || 'Opción')}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
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

        // 3. NÚMEROS
        config.fields.forEach(field => {
            if (field.type === 'number' && formattedData[field.name]) {
                formattedData[field.name] = Number(formattedData[field.name]);
            }
        });

        console.log("PAYLOAD ENVIADO A JAVA:", JSON.stringify(formattedData, null, 2));
        onSubmit(formattedData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.fields.map((field) => (
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
                                defaultValue={editData ? editData[field.name] : undefined}
                                isDark={isDark}
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
                                className={`transition-colors border ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F5B041]' : 'bg-neutral-100 border-neutral-300 text-black placeholder:text-neutral-500 focus:border-[#F5B041]'}`}
                                step={field.type === 'time' ? '60' : undefined}
                            />
                        )}
                    </div>
                ))}
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

    const handleSearch = async () => {
        if (!selectedTable || !searchId) return;
        setIsLoading(true);
        try {
            // Intento 1: Búsqueda directa por ID (Solo si es número)
            let directData = null;
            if (!isNaN(Number(searchId))) {
                const res = await fetch(`http://localhost:8080${selectedTable.endpoint}/${searchId}`);
                if (res.ok) {
                    directData = await res.json();
                }
            }

            if (directData) {
                // ÉXITO DIRECTO
                if (Array.isArray(directData.cast)) directData.cast = directData.cast.join(', ');
                setEditData(directData);
                toast.success('Registro cargado');
            } else {
                // Intento 2: Búsqueda Local (Fallback inteligente)
                // Descarga todo y busca por ID o NOMBRE/TITULO
                const resAll = await fetch(`http://localhost:8080${selectedTable.endpoint}`);
                if (resAll.ok) {
                    const allData = await resAll.json();
                    if (Array.isArray(allData)) {
                        const term = searchId.toLowerCase();
                        const found = allData.find((item: any) => {
                            const idMatch = item.id == searchId;
                            const nameMatch = (item.name || item.title || item.nombre || '').toString().toLowerCase().includes(term);
                            return idMatch || nameMatch;
                        });

                        if (found) {
                            if (Array.isArray(found.cast)) found.cast = found.cast.join(', ');
                            setEditData(found);
                            toast.success(`Encontrado: ${found.name || found.title || found.nombre} (ID: ${found.id})`);
                            return;
                        }
                    }
                }
                toast.error(`No se encontró "${searchId}" (IDs de Snacks inician en 101)`);
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
            const payload = { ...data, id: Number(searchId) };
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
            {adminSchema.map((table) => (
                <Dialog key={table.label} open={selectedTable?.label === table.label} onOpenChange={(open) => !open && handleClose(false)}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => setSelectedTable(table)}
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
                                    config={table}
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
                                        config={table}
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
            ))}
        </div>
    );
}