from faker import Factory

fake = Factory.create('en_US')


def get_employees(max=30):
    emp_list = []
    for x in range(0, max):
        emp = dict()
        emp['first_name'] = fake.first_name()
        emp['last_name'] = fake.last_name()
        emp['middle_name'] = fake.last_name()
        emp['address'] = fake.address()
        emp['contact_no'] = fake.phone_number()
        emp['designation'] = fake.job()
        emp_list.append(emp)
    return emp_list
