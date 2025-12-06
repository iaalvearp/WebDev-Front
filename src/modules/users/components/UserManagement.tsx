import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import type { User } from '../types/User';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Trash2, Edit, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<User>>({
        nombre: '',
        email: '',
        password: '',
        rol: 'USER'
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            toast.error('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentUser.id) {
                await userService.update(currentUser.id, currentUser);
                toast.success('Usuario actualizado');
            } else {
                await userService.create(currentUser as User);
                toast.success('Usuario creado');
            }
            setIsDialogOpen(false);
            fetchUsers();
            resetForm();
        } catch (error) {
            toast.error('Error al guardar usuario');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
        try {
            await userService.delete(id);
            toast.success('Usuario eliminado');
            fetchUsers();
        } catch (error) {
            toast.error('Error al eliminar usuario');
        }
    };

    const handleEdit = (user: User) => {
        setCurrentUser({ ...user, password: '' }); // Don't show password
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setCurrentUser({ nombre: '', email: '', password: '', rol: 'USER' });
        setIsEditing(false);
    };

    if (loading) return <div>Cargando usuarios...</div>;

    return (
        <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button
                            className="text-black font-bold hover:opacity-90 border-none"
                            style={{ background: 'linear-gradient(to right, hsl(var(--cinema-gold)), hsl(var(--cinema-gold-light)))' }}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Nuevo Usuario
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Nombre</label>
                                <Input
                                    value={currentUser.nombre}
                                    onChange={e => setCurrentUser({ ...currentUser, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    value={currentUser.email}
                                    onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Contraseña {isEditing && '(Dejar en blanco para no cambiar)'}</label>
                                <Input
                                    type="password"
                                    value={currentUser.password}
                                    onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })}
                                    required={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Rol</label>
                                <Select
                                    value={currentUser.rol}
                                    onValueChange={(value: 'ADMIN' | 'USER') => setCurrentUser({ ...currentUser, rol: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">Usuario</SelectItem>
                                        <SelectItem value="ADMIN">Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                type="submit"
                                className="w-full text-black font-bold hover:opacity-90 border-none"
                                style={{ background: 'linear-gradient(to right, hsl(var(--cinema-gold)), hsl(var(--cinema-gold-light)))' }}
                            >
                                Guardar
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.nombre}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.rol}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(user.id!)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
