from faker import Factory

fake = Factory.create('en_US')

test_password = 'password123'

test_users = [
    {
        'username': 'admin',
        'role_id': 1
    },
    {
        'username': 'localuser',
        'password': 'localuser',
        'role_id': 2
    }
]
