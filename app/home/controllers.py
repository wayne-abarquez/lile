from . import home
from flask import render_template, request, Response
from app.utils.html2canvasproxy import *
import logging

log = logging.getLogger(__name__)

real_path = '/var/www/lile/client/static/downloads'
virtual_path = '/static/downloads'

@home.route('/', methods=['GET', 'POST'])
@home.route('/index', methods=['GET', 'POST'])
def index():
    return render_template('/index.html')


@home.route('/html2canvasproxy')
def get_html2canvasproxy():
    log.debug(request)
    h2c = html2canvasproxy(request.args.get('callback'), request.args.get('url'))
    # h2c.enableCrossDomain() #Uncomment this line to enable the use of "Data URI scheme"
    h2c.userAgent(request.headers['user_agent'])
    h2c.hostName(request.url)
    if request.referrer is not None:
        h2c.referer(request.referrer)
    h2c.route(real_path, virtual_path)
    if request.args.get('debug_vars'):  #
        return Response(str(h2c.debug_vars()), mimetype='text/plain')
    r = h2c.result()
    return Response(r['data'], mimetype=r['mime'])
