import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Avatar, AvatarBadge, Button, Heading } from "@chakra-ui/react"
import { useDropzone } from "react-dropzone"
import { useColorModeValue } from "@chakra-ui/react"
import ChangeTheme from "./mini_components/ChangeTheme"
import "./Profile.css"
import { Text } from "@chakra-ui/react"
export default function Profile() {
    const { userId } = useParams()
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState(null)
    const [users, setUsers] = useState([])
    const [preview, setPreview] = useState(null)

    const bg = useColorModeValue("profileLight", "profileDark")

    useEffect(() => {
        const data = localStorage.getItem("user")
        if (data) {
            const parsed = JSON.parse(data)
            setUsers(parsed)
            const found = parsed.find(u => u.id === userId)
            setCurrentUser(found)
            setPreview(found?.profilePhoto ?? null)
        }
    }, [userId])

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if (!file) return
        if (file.size > 1 * 1024 * 1024) {
            alert("La imagen no puede superar 1MB")
            return
        }
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result
            setPreview(base64)
        }
        reader.readAsDataURL(file)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
        maxSize: 1 * 1024 * 1024
    })

    const handleSavePhoto = () => {
        const updated = users.map(u =>
            u.id === userId ? { ...u, profilePhoto: preview } : u
        )
        localStorage.setItem("user", JSON.stringify(updated))
        setCurrentUser(prev => ({ ...prev, profilePhoto: preview }))
        alert("Foto actualizada")
    }

    const handleExport = () => {
        const data = localStorage.getItem("user")
        const blob = new Blob([data], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `taskflow_${currentUser?.userName}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    if (!currentUser) return <p className="profileLoading">Cargando...</p>

    return (
        <div className={`profileContainer ${bg}`}>

            {/* Header */}
            <div className="profileHeader">
                <button className="profileBackBtn" onClick={() => navigate(`/projects/${userId}`)}>
                    ← Volver
                </button>
                <ChangeTheme />
            </div>

            {/* Avatar */}
            <div className="profileAvatarSection">
                <div {...getRootProps()} className={`profileDropzone ${isDragActive ? "profileDropzoneActive" : ""}`}>
                    <input {...getInputProps()} />
                    <Avatar
                        src={preview ?? undefined}
                        name={currentUser.userName}
                        size="2xl"
                        opacity={isDragActive ? 0.5 : 1}
                    >
                        <AvatarBadge boxSize="1em" bg="teal.400" />
                    </Avatar>
                    <p className="profileDropzoneHint">
                        {isDragActive ? "Suelta aquí" : "Arrastra o haz clic para cambiar foto"}
                    </p>
                </div>

                {preview !== currentUser.profilePhoto && (
                    <Button colorScheme="teal" size="sm" onClick={handleSavePhoto}>
                        Guardar foto
                    </Button>
                )}
            </div>

            {/* Info */}
            <div className="profileInfo">
                <h2 className="profileName">{currentUser.userName}</h2>
                <p className="profileStats">
                    {currentUser.projects?.length ?? 0} proyectos propios
                </p>
                <p className="profileStats">
                    {currentUser.sharedProjects?.length ?? 0} proyectos compartidos
                </p>
            </div>

            {/* Acciones */}
            <div className="profileActions">
                <Button
                    colorScheme="blue"
                    width="100%"
                    onClick={handleExport}
                >
                    Exportar datos a JSON
                </Button>
            </div>
        </div>
    )
}