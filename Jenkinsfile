pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Generate Coverage') {
            steps {
                sh 'npm run coverage'
            }
        }

        stage('SonarQube Analysis') {
            when {
                branch 'main'
            }
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=react-task-tracker \
                            -Dsonar.sources=src \
                            -Dsonar.tests=src \
                            -Dsonar.test.inclusions='src/**/*.test.jsx' \
                            -Dsonar.exclusions='src/**/*.test.jsx' \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            when {
                branch 'main'
            }
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                sh 'npm run build'
            }
        }

        stage('Archive Artifact') {
            when {
                branch 'main'
            }
            steps {
                sh 'tar -czf react-app-${BUILD_NUMBER}.tar.gz dist Dockerfile'
                archiveArtifacts artifacts: 'react-app-*.tar.gz',
                                 fingerprint: true
            }
        }
    }
}
