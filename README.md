# tirith-iac-security-scanner
An AWS IaC security scanner for CloudFormation templates.

-----

### Running instructions

Here are the steps for anyone who clones this repository to get it running on their local machine.

1.  **Prerequisites:** Ensure you have **Git** and **pnpm** installed on your system.

      * *Note: This project uses **pnpm**, not npm or yarn. Using a different package manager may cause issues.*

2.  **Clone the Repository:** Open your terminal and run the following command, replacing `<repository-url>` with your Git URL.

    ```bash
    git clone <repository-url>
    ```

3.  **Navigate to Project Directory:**

    ```bash
    cd <project-name>
    ```

4.  **Install Dependencies:** Run the **pnpm** install command. This reads the `pnpm-lock.yaml` file to install the exact versions of all project dependencies and creates the `node_modules` folder.

    ```bash
    pnpm install
    ```

5.  **Build the Frontend:**

    ```bash
    pnpm build
    ```
    
6.  **Run the Development Server:** Start the Flask development server to view the application in your browser.

    ```bash
    python3 main.py
    ```

    Your terminal will output the local URL where the application is running (usually `http://localhost:8080`).
