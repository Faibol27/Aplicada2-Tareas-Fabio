import request from 'supertest'
import { prisma } from '../src/db.js'
import app from '../src/app.js'

const API_KEY_HEADER = 'x-api-key'
const VALID_API_KEY = process.env.API_KEY || '512ea06cf63d8a141a371a2259fc038eca2ae8dd2ec57ba46672a6ecd9ea99f3'

let testUser

beforeAll(async () => {
    testUser = await prisma.usuario.create({
        data: { nombre: 'Usuario Tareas v1', email: 'tareav1@gmail.com', password: 'hashedpassword', rol: 'usuario', },
    })
})

afterAll(async () => {
    await prisma.tarea.deleteMany({ where: { usuarioId: testUser.id } })
    await prisma.usuario.deleteMany({ where: { id: testUser.id } })
    await prisma.$disconnect()
})

describe('API Key Middleware (/v1/tareas)', () => {
    it('denegar el acceso (401 o 403) si no se proporciona API Key', async () => {
        const res = await request(app).get('/v1/tareas')
        expect([401, 403]).toContain(res.status)
    })
})

describe('POST /v1/tareas', () => {
    it('crear una tarea pública exitosamente con API Key', async () => {
        const res = await request(app)
            .post('/v1/tareas')
            .set(API_KEY_HEADER, VALID_API_KEY)
            .send({
                titulo: 'Aprender testing con Supertest v1',
                usuarioId: testUser.id,
            })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('titulo', 'Aprender testing con Supertest v1')
        expect(res.body).toHaveProperty('usuarioId', testUser.id)
    })

    it('responde con error 500 si falla la base de datos (ej. usuarioId inexistente)', async () => {
        const res = await request(app)
            .post('/v1/tareas')
            .set(API_KEY_HEADER, VALID_API_KEY)
            .send({
                titulo: 'Tarea inválida',
                usuarioId: 99,
            })
        expect(res.status).toBe(500)
        expect(res.body).toHaveProperty('error', 'Error interno del servidor')
    })
})

describe('GET /v1/tareas', () => {
    it('listar todas las tareas públicas con API Key válida', async () => {
        const res = await request(app)
            .get('/v1/tareas')
            .set(API_KEY_HEADER, VALID_API_KEY)
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBeGreaterThanOrEqual(1)
        expect(res.body[0]).toHaveProperty('id')
        expect(res.body[0]).toHaveProperty('titulo')
    })
})