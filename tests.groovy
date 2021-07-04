def Acceptance() {
    sh '''#!/bin/bash
      cd src
      source /usr/local/nvm/nvm.sh && nvm use default
      yarn test-acceptance $ACCEPTANCE_OPTS
    '''
}

def Unit() {
    sh '''#!/bin/bash
      cd src
      source /usr/local/nvm/nvm.sh && nvm use default
      yarn test-unit
    '''
}

return this
