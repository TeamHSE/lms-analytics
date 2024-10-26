using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddManagersData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.InsertData(
				table: "Managers",
				columns: new[] { "Name", "Surname", "Lastname", "Email" },
				values: new object[,]
				{
					{ "Дмитрий", "Тимофеев", "Игоревич", "ditimofeev@mail.ru" },
					{ "Наталья", "Ромашова", "Романовна", "nrromashova@mail.ru" },      
					{ "Сергей", "Сидоров", "Игоревич", "sisidorov@mail.ru" },           
					{ "Максим", "Сидоров", "Александрович", "masidorov@mail.ru" },      
					{ "Иван", "Степанов", "Алексеевич", "iastepanov@mail.ru" },     
				});
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
