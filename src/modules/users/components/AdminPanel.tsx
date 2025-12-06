import { useState, useEffect, useCallback, memo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Search, Save, Loader2 } from 'lucide-react';
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

const DynamicSelect = memo(({ field, setValue, defaultValue }: { field: AdminField, setValue: any, defaultValue?: any }) => {
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
            <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                <SelectValue placeholder={`Seleccionar ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
                {options.map((opt) => (
                    <SelectItem key={String(opt[field.sourceValue || 'id'])} value={String(opt[field.sourceValue || 'id'])}>
                        {opt[field.sourceLabel || 'name'] || opt['nombre'] || 'Opción'}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
});
DynamicSelect.displayName = 'DynamicSelect';

const DynamicMultiSelect = memo(({ field, setValue, defaultValue }: { field: AdminField, setValue: any, defaultValue?: any }) => {
    const [options, setOptions] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>(Array.isArray(defaultValue) ? defaultValue : []);

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

    useEffect(() => {
        setValue(field.name, selected);
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
            <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-md min-h-[3rem]">
                {options.map((opt) => {
                    const val = String(opt[field.sourceValue || 'id']);
                    const isSelected = selected.includes(val);
                    return (
                        <button
                            type="button"
                            key={val}
                            onClick={() => toggleSelection(val)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${isSelected
                                ? 'bg-[#F5B041] text-black shadow-lg scale-105'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            {opt[field.sourceLabel || 'name'] || opt['nombre']}
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-muted-foreground">Selecciona entre 1 y 3 opciones.</p>
        </div>
    );
});
DynamicMultiSelect.displayName = 'DynamicMultiSelect';

// --- COMPONENTE DE FORMULARIO DINÁMICO ---
const DynamicForm = memo(({
    config,
    editData,
    onSubmit,
    isLoading
}: {
    config: AdminTableConfig,
    editData?: any,
    onSubmit: (data: any) => void,
    isLoading: boolean
}) => {
    const { register, handleSubmit, setValue, watch, reset } = useForm();

    useEffect(() => {
        if (editData) {
            reset(editData);
        } else {
            reset({});
        }
    }, [editData, reset]);

    const handleFormSubmit = (data: any) => {
        const formattedData = { ...data };

        // Validaciones Manuales antes de enviar
        for (const field of config.fields) {
            if (field.type === 'multi-select') {
                const val = formattedData[field.name];
                if (!val || (Array.isArray(val) && val.length === 0)) {
                    toast.error(`El campo ${field.label} requiere al menos una selección.`);
                    return;
                }
            }
            if (field.type === 'number') {
                formattedData[field.name] = Number(formattedData[field.name]);
            }
        }

        onSubmit(formattedData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.fields.map((field) => (
                    <div key={field.name} className={
                        ['textarea', 'multi-select'].includes(field.type) ? 'col-span-2' : 'col-span-1'
                    }>
                        <Label className="text-white mb-1.5 block text-xs uppercase tracking-wider">{field.label}</Label>

                        {field.type === 'textarea' ? (
                            <Textarea
                                {...register(field.name)}
                                className="bg-white/5 border-white/10 text-white min-h-[100px] focus:border-[#F5B041]"
                            />
                        ) : field.type === 'select' ? (
                            <DynamicSelect
                                field={field}
                                setValue={setValue}
                                defaultValue={editData ? editData[field.name] : undefined}
                            />
                        ) : field.type === 'multi-select' ? (
                            <DynamicMultiSelect
                                field={field}
                                setValue={setValue}
                                defaultValue={editData ? editData[field.name] : []}
                            />
                        ) : field.type === 'boolean' ? (
                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                                <Switch
                                    className="data-[state=unchecked]:bg-white/20 data-[state=checked]:bg-[#F5B041]"
                                    checked={watch(field.name)}
                                    onCheckedChange={(c) => setValue(field.name, c)}
                                />
                                <span className="text-sm font-medium text-white">{watch(field.name) ? 'ACTIVADO' : 'DESACTIVADO'}</span>
                            </div>
                        ) : (
                            <Input
                                type={field.type === 'date' ? 'date' : field.type === 'time' ? 'time' : 'text'}
                                {...register(field.name)}
                                className="bg-white/5 border-white/10 text-white focus:border-[#F5B041]"
                                step={field.type === 'time' ? '60' : undefined}
                            />
                        )}
                    </div>
                ))}
            </div>
            <Button disabled={isLoading} type="submit" className="w-full bg-[#F5B041] hover:bg-[#F5B041]/90 text-black font-bold h-12 mt-4">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                GUARDAR REGISTRO
            </Button>
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
            } else {
                toast.error('Error al crear. Verifica los datos.');
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
            const res = await fetch(`http://localhost:8080${selectedTable.endpoint}/${searchId}`);
            if (res.ok) {
                const data = await res.json();
                setEditData(data);
                toast.success('Datos cargados');
            } else {
                toast.error('ID no encontrado');
                setEditData(null);
            }
        } catch (e) {
            toast.error('Error al buscar');
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
            } else {
                toast.error('Error al actualizar');
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
                <Dialog key={table.label} onOpenChange={handleClose}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => setSelectedTable(table)}
                            variant="outline"
                            className="h-24 flex flex-col items-center justify-center gap-2 border-white/10 bg-white/5 hover:bg-[#F5B041]/20 hover:border-[#F5B041] transition-all"
                        >
                            <span className="text-lg font-bold">{table.label}</span>
                            <span className="text-xs text-muted-foreground">Administrar</span>
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-3xl bg-black/90 backdrop-blur-xl border-white/10 text-white sm:rounded-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#F5B041]">
                                {table.label}
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Gestiona los registros de la tabla {table.label.toLowerCase()}.
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                            <TabsList className="grid w-full grid-cols-2 bg-white/10 p-1 rounded-xl">
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
                                />
                            </TabsContent>

                            <TabsContent value="modify" className="mt-4">
                                <div className="flex gap-2 mb-6">
                                    <Input
                                        placeholder="Ingresa el ID..."
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white focus:border-[#F5B041]"
                                    />
                                    <Button onClick={handleSearch} disabled={isLoading} className="bg-white/10 hover:bg-white/20">
                                        <Search className="w-4 h-4" />
                                    </Button>
                                </div>
                                {editData && (
                                    <DynamicForm
                                        config={table}
                                        editData={editData}
                                        onSubmit={handleUpdate}
                                        isLoading={isLoading}
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