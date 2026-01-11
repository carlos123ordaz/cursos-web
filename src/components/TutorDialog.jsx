import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    MenuItem,
    IconButton,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';

const TutorDialog = ({
    open,
    onClose,
    tutorData,
    onChange,
    onSave,
    isEditing,
    showPassword,
    onTogglePassword,
    saving = false,
}) => {
    const specialties = [
        '3D y Animación',
        'Diseño Web y App',
        'Ilustración',
        'Fotografía',
        'Marketing',
        'Programación',
    ];

    const documentTypes = [
        { value: 'DNI', label: 'DNI' },
        { value: 'CE', label: 'Carnet de Extranjería' },
        { value: 'PASAPORTE', label: 'Pasaporte' },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
                {isEditing ? 'Editar Tutor' : 'Crear Nuevo Tutor'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {/* Información Personal */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Nombres"
                            value={tutorData.firstName}
                            onChange={(e) => onChange({ ...tutorData, firstName: e.target.value })}
                            placeholder="Ej: Juan Carlos"
                            required
                            disabled={saving}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Apellidos"
                            value={tutorData.lastName}
                            onChange={(e) => onChange({ ...tutorData, lastName: e.target.value })}
                            placeholder="Ej: García López"
                            required
                            disabled={saving}
                        />
                    </Grid>

                    {/* Documento de Identidad */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            select
                            label="Tipo de Documento"
                            value={tutorData.documentType}
                            onChange={(e) => onChange({ ...tutorData, documentType: e.target.value })}
                            required
                            disabled={saving}
                        >
                            {documentTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Número de Documento"
                            value={tutorData.documentNumber}
                            onChange={(e) => onChange({ ...tutorData, documentNumber: e.target.value })}
                            placeholder="Ej: 12345678"
                            required
                            disabled={saving}
                        />
                    </Grid>

                    {/* Contacto */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={tutorData.email}
                            onChange={(e) => onChange({ ...tutorData, email: e.target.value })}
                            placeholder="tutor@ejemplo.com"
                            required
                            disabled={saving || isEditing} // No permitir cambiar email en edición
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Teléfono"
                            value={tutorData.phone}
                            onChange={(e) => onChange({ ...tutorData, phone: e.target.value })}
                            placeholder="+51 999 888 777"
                            disabled={saving}
                        />
                    </Grid>

                    {/* Credenciales de Acceso */}
                    {!isEditing && (
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                value={tutorData.password}
                                onChange={(e) => onChange({ ...tutorData, password: e.target.value })}
                                placeholder="Mínimo 6 caracteres"
                                required
                                disabled={saving}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={onTogglePassword}
                                                edge="end"
                                                disabled={saving}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                helperText="Esta será la contraseña de acceso del tutor a la plataforma"
                            />
                        </Grid>
                    )}

                    {/* Información Profesional */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            select
                            label="Especialidad"
                            value={tutorData.specialty}
                            onChange={(e) => onChange({ ...tutorData, specialty: e.target.value })}
                            required
                            disabled={saving}
                        >
                            {specialties.map((spec) => (
                                <MenuItem key={spec} value={spec}>
                                    {spec}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Biografía"
                            multiline
                            rows={4}
                            value={tutorData.bio}
                            onChange={(e) => onChange({ ...tutorData, bio: e.target.value })}
                            placeholder="Breve descripción profesional del tutor..."
                            disabled={saving}
                        />
                    </Grid>

                    {/* Estado - Solo mostrar al editar */}
                    {isEditing && (
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                select
                                label="Estado"
                                value={tutorData.status}
                                onChange={(e) => onChange({ ...tutorData, status: e.target.value })}
                                disabled={saving}
                            >
                                <MenuItem value="Activo">Activo</MenuItem>
                                <MenuItem value="Inactivo">Inactivo</MenuItem>
                            </TextField>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} disabled={saving}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={onSave}
                    disabled={saving}
                    sx={{
                        bgcolor: '#ff5722',
                        '&:hover': { bgcolor: '#e64a19' },
                        textTransform: 'none',
                        minWidth: 120,
                    }}
                >
                    {saving ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                        isEditing ? 'Guardar Cambios' : 'Crear Tutor'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TutorDialog;