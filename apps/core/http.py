def wants_partial(request):
    """True quando o cliente espera só o fragmento HTML (fetch/AJAX)."""
    return request.headers.get('X-Requested-With') == 'XMLHttpRequest'
