name = "John"
age = 30

data = {name: name, age: age}

# using printf syntax
print(_(f"My name is %(name)s and I am %(age)d years old.") % data)

# Using deprecated syntax
print(_("My name is $name and I am $age years old."))

# using printf syntax
print(_(f"My name is %s and I am %d years old.") % (name, age))

# Using f-string
print(_(f"My name is {name} and I am {age} years old."))

# Using f-string and including quotes
print(_(f'My name is "{name}" and I am {age} years old.'))
