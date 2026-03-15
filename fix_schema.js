const { pool } = require('./db');

async function fixSchema() {
    try {
        console.log('Verificando colunas da tabela users...');
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
        const columns = res.rows.map(r => r.column_name);
        
        if (columns.includes('password_hash') && !columns.includes('password')) {
            console.log('Renomeando password_hash para password...');
            await pool.query('ALTER TABLE users RENAME COLUMN password_hash TO password');
        }
        
        if (!columns.includes('menu_access')) {
            console.log('Adicionando coluna menu_access...');
            await pool.query("ALTER TABLE users ADD COLUMN menu_access JSONB DEFAULT '[]'::jsonb");
        }
        
        console.log('Esquema atualizado com sucesso!');
        process.exit(0);
    } catch (err) {
        console.error('Erro ao atualizar esquema:', err.message);
        process.exit(1);
    }
}

fixSchema();
