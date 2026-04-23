from flask import Flask, render_template, request, redirect, url_for, flash
import database
import re

app = Flask(__name__)
app.secret_key = 'super_secret_key_for_flash_messages'

@app.route('/')
def index():
    return render_template('menu.html')

@app.route('/nova-reserva', methods=['GET', 'POST'])
def nova_reserva():
    if request.method == 'POST':
        razao_social = request.form.get('razao_social', '').strip()
        cnpj = request.form.get('cnpj', '').strip()
        inscricao_estadual = request.form.get('inscricao_estadual', '').strip()
        cep = request.form.get('cep', '').strip()
        produto = request.form.get('produto', '').strip()
        telefone = request.form.get('telefone', '').strip()

        errors = []
        
        # Validações no Backend
        if len(razao_social) < 3:
            errors.append("A Razão Social deve ter no mínimo 3 caracteres.")
        if not re.match(r'^\d{14}$', cnpj):
            errors.append("O CNPJ deve conter exatamente 14 números.")
        if not inscricao_estadual:
            errors.append("A Inscrição Estadual é obrigatória.")
        if not re.match(r'^\d{8}$', cep):
            errors.append("O CEP deve conter exatamente 8 números.")
        if len(produto) < 2:
            errors.append("O produto/carga deve ser especificado.")
        if len(telefone) < 10:
            errors.append("O telefone deve ter pelo menos 10 dígitos.")

        if errors:
            return render_template('nova_reserva.html', errors=errors, form=request.form)

        # Salvar no Banco
        try:
            conn = database.get_db_connection()
            conn.execute('''
                INSERT INTO reservas (razao_social, cnpj, inscricao_estadual, cep, produto, telefone)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (razao_social, cnpj, inscricao_estadual, cep, produto, telefone))
            conn.commit()
            conn.close()
            
            flash('Reserva enviada com sucesso! Um operador receberá uma notificação em breve.', 'success')
            return redirect(url_for('nova_reserva'))
        except Exception as e:
            errors.append(f"Erro ao salvar no banco de dados: {str(e)}")
            return render_template('nova_reserva.html', errors=errors, form=request.form)

    # Requisição GET
    return render_template('nova_reserva.html')

@app.route('/status')
def status():
    # Simulando dados de status
    services = [
        {"name": "Servidor Web (Flask)", "status": "operational", "uptime": "99.9%"},
        {"name": "Banco de Dados (SQLite)", "status": "operational", "uptime": "100%"},
        {"name": "Integração WhatsApp", "status": "degraded", "uptime": "95.5%"},
    ]
    return render_template('status.html', services=services)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
