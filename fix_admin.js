const { pool } = require('./db');

async function fixAdmin() {
    const menus = ['Usuário', 'Gerir Eventos', 'Notícias & RSS', 'Personalizar Site', 'Banco de Dados', 'Pagamentos'];
    try {
        await pool.query('UPDATE users SET menu_access = $1 WHERE username = $2', [JSON.stringify(menus), 'admin']);
        console.log('Permissões do admin sincronizadas no banco de dados!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixAdmin();
