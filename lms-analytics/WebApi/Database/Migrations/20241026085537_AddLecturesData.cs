using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddLecturesData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.InsertData(
				table: "Lecturers",
				columns: new[] { "Name", "Surname", "Lastname", "Email" },
				values: new object[,]
				{
					{ "Павел", "Орлов", "Сергеевич", "psorlov@mail.ru" },
					{ "Дмитрий", "Тихонов", "Петрович", "dptikhonov@mail.ru" },       
					{ "Ксения", "Соловьёва", "Владимировна", "kvsolovyova@mail.ru" }, 
					{ "Максим", "Иванов", "Станиславович", "msivanov@mail.ru" },      
					{ "Мария", "Мельникова", "Алексеевна", "mamelnikova@mail.ru" },   
					{ "Иван", "Петров", "Николаевич", "inpetrov@mail.ru" },           
					{ "Анна", "Григорьева", "Станиславовна", "asgrigoreva@mail.ru" }, 
					{ "Юлия", "Фёдорова", "Викторовна", "yvfyodorova@mail.ru" },
				});
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
