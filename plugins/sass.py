import os
import pipes

def postBuild(site):
    os.system(
        'sass -t compressed --update %s/static/css/*.scss' % 
            pipes.quote(site.paths['build']
    ))
    
