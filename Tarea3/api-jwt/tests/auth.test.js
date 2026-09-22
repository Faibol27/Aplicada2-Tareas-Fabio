import request from 'supertest'
import { prisma } from '../src/db.js'
import app from "../src/app.js"

afterAll(async () => {
    await prisma.usuario.delete({ where: { email: "test@gmail.com" } });
    prisma.$disconnect;
})

describe('POST /auth/registro', () => {
    it("deberias registrar un usuario correctamente", async () => {
        const res = await request(app)
            .post("/auth/registro")
            .send({
                nombre: "Test User",
                email: "test@gmail.com",
                password: "1234",
                rol: "usuario"
            })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("id")
        expect(res.body).not.toHaveProperty("password")
    })
    it("email ya registrado", async () => {
        const res = await request(app)
            .post("/auth/registro")
            .send({
                nombre: "test User",
                email: "test@gmail.com",
                password: "1234",
                rol: "usuario"
            })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("error")
    })
    it("email vacio", async () => {
        const res = await request(app)
            .post("/auth/registro")
            .send({
                nombre: "test User",
                email: "",
                password: "1234",
                rol: "usuario"
            })
        expect(res.status).toBe(400)
        expect(res.body).not.toHaveProperty("email")
    })
    it('debería iniciar sesión correctamente con credenciales válidas y devolver un token', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: "test@gmail.com",
                password: '1234',
            })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token')
        expect(typeof res.body.token).toBe('string')
    })

    it('debería fallar si el email no existe', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'noexiste@gmail.com',
                password: '1234',
            })

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('error', 'Credenciales inválidas')
        expect(res.body).not.toHaveProperty('token')
    })

    it('debería fallar si la contraseña es incorrecta', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: "test@gmail.com",
                password: 'password_erroneo',
            })

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('error', 'Credenciales inválidas')
        expect(res.body).not.toHaveProperty('token')
    })

})
