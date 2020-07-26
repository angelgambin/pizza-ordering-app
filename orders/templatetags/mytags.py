import json
from django import template

register = template.Library()

# creates a template tag to load the content of a json doc

@register.filter
def loadjson(data):
    return json.loads(data)